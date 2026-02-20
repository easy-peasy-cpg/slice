import { useState, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useSlice } from '../context/SliceContext'
import toast from 'react-hot-toast'

// Common Whole Foods / retail report column name patterns
const STORE_PATTERNS = ['store name', 'store', 'location', 'store #', 'store number', 'facility', 'facility name']
const SKU_PATTERNS = ['item description', 'description', 'product', 'product name', 'item', 'upc', 'sku', 'item name']
const WEEK_PATTERNS = ['week ending', 'week end', 'week end date', 'week', 'date', 'period', 'report week']
const UNITS_PATTERNS = ['units sold', 'units', 'movement', 'qty', 'quantity', 'total units', 'scan units']

function detectColumn(headers, patterns) {
  for (const pattern of patterns) {
    const match = headers.find(h => h.toLowerCase().trim() === pattern)
    if (match) return match
  }
  for (const pattern of patterns) {
    const match = headers.find(h => h.toLowerCase().trim().includes(pattern))
    if (match) return match
  }
  return ''
}

function parseDate(raw) {
  if (!raw) return null
  const str = String(raw).trim()

  // Excel serial number
  if (/^\d+$/.test(str)) {
    const date = XLSX.SSF.parse_date_code(Number(str))
    if (date) {
      const y = date.y, m = String(date.m).padStart(2, '0'), d = String(date.d).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }

  // Try native Date parse
  const d = new Date(str)
  if (!isNaN(d)) {
    return d.toISOString().slice(0, 10)
  }

  return null
}

function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export default function Import() {
  const { user } = useAuth()
  const { skus, stores, refetch } = useSlice()
  const fileRef = useRef()

  const [rows, setRows] = useState([])
  const [headers, setHeaders] = useState([])
  const [mapping, setMapping] = useState({ store: '', sku: '', week: '', units: '' })
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setRows([])
    setResult(null)

    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data, meta }) => {
          setHeaders(meta.fields || [])
          setRows(data)
          autoDetect(meta.fields || [])
        },
      })
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const fields = data.length > 0 ? Object.keys(data[0]) : []
        setHeaders(fields)
        setRows(data)
        autoDetect(fields)
      }
      reader.readAsArrayBuffer(file)
    } else {
      toast.error('Please upload a CSV or Excel (.xlsx) file')
    }
  }

  function autoDetect(fields) {
    setMapping({
      store: detectColumn(fields, STORE_PATTERNS),
      sku: detectColumn(fields, SKU_PATTERNS),
      week: detectColumn(fields, WEEK_PATTERNS),
      units: detectColumn(fields, UNITS_PATTERNS),
    })
  }

  async function handleImport() {
    if (!mapping.store || !mapping.sku || !mapping.week || !mapping.units) {
      toast.error('Map all four columns before importing')
      return
    }

    setImporting(true)
    setResult(null)

    let created = 0, skipped = 0, errors = 0

    // Build lookup maps for existing SKUs and stores
    const skuMap = new Map(skus.map(s => [s.name.toLowerCase().trim(), s.id]))
    const storeMap = new Map(stores.map(s => [s.name.toLowerCase().trim(), s.id]))

    // Collect unique SKU and store names to upsert
    const newSkuNames = new Set()
    const newStoreNames = new Set()

    for (const row of rows) {
      const skuName = String(row[mapping.sku] || '').trim()
      const storeName = String(row[mapping.store] || '').trim()
      if (skuName && !skuMap.has(skuName.toLowerCase())) newSkuNames.add(skuName)
      if (storeName && !storeMap.has(storeName.toLowerCase())) newStoreNames.add(storeName)
    }

    // Insert new SKUs
    if (newSkuNames.size > 0) {
      const { data: inserted } = await supabase.from('skus').insert(
        [...newSkuNames].map(name => ({ name, user_id: user.id }))
      ).select()
      if (inserted) inserted.forEach(s => skuMap.set(s.name.toLowerCase().trim(), s.id))
    }

    // Insert new stores — try to detect retailer from name
    if (newStoreNames.size > 0) {
      const RETAILERS = ['Whole Foods', 'Sprouts', 'Natural Grocers', 'Wegmans', 'HEB', 'Publix', 'Kroger']
      const { data: inserted } = await supabase.from('stores').insert(
        [...newStoreNames].map(name => {
          const retailer = RETAILERS.find(r => name.toLowerCase().includes(r.toLowerCase())) || 'Whole Foods'
          return { name, retailer, user_id: user.id }
        })
      ).select()
      if (inserted) inserted.forEach(s => storeMap.set(s.name.toLowerCase().trim(), s.id))
    }

    // Build sales report rows
    const reportRows = []
    for (const row of rows) {
      const skuName = String(row[mapping.sku] || '').trim()
      const storeName = String(row[mapping.store] || '').trim()
      const rawDate = row[mapping.week]
      const rawUnits = row[mapping.units]

      if (!skuName || !storeName || !rawDate) { skipped++; continue }

      const dateStr = parseDate(rawDate)
      if (!dateStr) { skipped++; continue }
      const weekStart = getMonday(dateStr)

      const units = parseFloat(String(rawUnits).replace(/,/g, '')) || 0
      const skuId = skuMap.get(skuName.toLowerCase())
      const storeId = storeMap.get(storeName.toLowerCase())

      if (!skuId || !storeId) { errors++; continue }

      reportRows.push({
        user_id: user.id,
        sku_id: skuId,
        store_id: storeId,
        week_start: weekStart,
        units_sold: units,
      })
    }

    // Upsert in batches of 200
    const BATCH = 200
    for (let i = 0; i < reportRows.length; i += BATCH) {
      const batch = reportRows.slice(i, i + BATCH)
      const { error } = await supabase.from('sales_reports').upsert(batch, {
        onConflict: 'user_id,sku_id,store_id,week_start',
      })
      if (error) { errors += batch.length } else { created += batch.length }
    }

    await refetch()
    setImporting(false)
    setResult({ created, skipped, errors })
    if (errors === 0) toast.success(`Imported ${created} records`)
    else toast.error(`${errors} rows failed — check column mapping`)
  }

  const canImport = rows.length > 0 && mapping.store && mapping.sku && mapping.week && mapping.units

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Import Sales Data</h1>
        <p className="text-slate-500 text-sm mt-1">Upload a Whole Foods weekly sales report (CSV or Excel)</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
      >
        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        {fileName ? (
          <p className="text-sm font-medium text-slate-700">{fileName}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">Drop your file here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Supports CSV and Excel (.xlsx)</p>
          </>
        )}
      </div>

      {/* Column mapping */}
      {headers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Map Columns</h2>
            <p className="text-sm text-slate-500 mt-0.5">We auto-detected your columns — adjust if needed.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'store', label: 'Store / Location' },
              { key: 'sku', label: 'Product / SKU' },
              { key: 'week', label: 'Week Ending Date' },
              { key: 'units', label: 'Units Sold' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                <select
                  value={mapping[key]}
                  onChange={(e) => setMapping(m => ({ ...m, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-500 bg-white outline-none"
                >
                  <option value="">— select column —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{rows.length} rows detected — preview</p>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    {['store', 'sku', 'week', 'units'].map(k => (
                      <th key={k} className="text-left px-3 py-2 text-slate-500 font-medium">{mapping[k] || '—'}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {['store', 'sku', 'week', 'units'].map(k => (
                        <td key={k} className="px-3 py-2 text-slate-700 truncate max-w-[140px]">
                          {mapping[k] ? String(row[mapping[k]] || '') : <span className="text-slate-300">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={!canImport || importing}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {importing ? 'Importing…' : `Import ${rows.length} rows`}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-5 ${result.errors === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <p className="font-semibold text-slate-800 mb-1">Import complete</p>
          <ul className="text-sm text-slate-600 space-y-0.5">
            <li>✓ {result.created} records imported</li>
            {result.skipped > 0 && <li>— {result.skipped} rows skipped (missing data)</li>}
            {result.errors > 0 && <li>✗ {result.errors} rows failed</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
