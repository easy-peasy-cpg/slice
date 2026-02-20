import { useState } from 'react'
import { useSlice } from '../context/SliceContext'

const fmt = (n) => new Intl.NumberFormat('en-US').format(n)

function getSkuStats(salesReports, skus) {
  const totals = {}
  const byWeek = {}

  for (const r of salesReports) {
    if (!totals[r.sku_id]) {
      totals[r.sku_id] = { total: 0, weeks: 0, stores: new Set() }
    }
    totals[r.sku_id].total += r.units_sold ?? 0
    totals[r.sku_id].stores.add(r.store_id)

    const key = `${r.sku_id}_${r.week_start}`
    byWeek[key] = (byWeek[key] || 0) + (r.units_sold ?? 0)
  }

  // Count distinct weeks per sku
  const weekCounts = {}
  for (const key of Object.keys(byWeek)) {
    const skuId = key.split('_')[0]
    weekCounts[skuId] = (weekCounts[skuId] || 0) + 1
  }

  return skus.map((sku) => {
    const stat = totals[sku.id] || { total: 0, stores: new Set() }
    const weeks = weekCounts[sku.id] || 0
    const avgPerWeek = weeks > 0 ? stat.total / weeks : 0
    return {
      ...sku,
      totalUnits: stat.total,
      storeCount: stat.stores.size,
      avgPerWeek,
      weeks,
    }
  })
}

export default function Velocity() {
  const { skus, salesReports, loading } = useSlice()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('totalUnits')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading…</span>
        </div>
      </div>
    )
  }

  const skuStats = getSkuStats(salesReports, skus)
  const maxUnits = Math.max(...skuStats.map((s) => s.totalUnits), 1)

  const filtered = skuStats
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || (s.sku_code || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sort] - a[sort])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Velocity</h1>
        <p className="text-slate-500 text-sm mt-1">Units sold per SKU across all retail doors</p>
      </div>

      {skus.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-800 font-semibold mb-1">No SKUs yet</p>
          <p className="text-slate-400 text-sm">Add your products to start tracking retail velocity.</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search SKUs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white outline-none placeholder-slate-400"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-500 bg-white outline-none"
            >
              <option value="totalUnits">Sort by Total Units</option>
              <option value="avgPerWeek">Sort by Avg/Week</option>
              <option value="storeCount">Sort by Store Count</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">SKU</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Total Units</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Avg / Week</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Stores</th>
                  <th className="px-5 py-3 hidden lg:table-cell w-40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-400 text-sm py-10">No SKUs match your search.</td>
                  </tr>
                ) : (
                  filtered.map((sku) => (
                    <tr key={sku.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-800">{sku.name}</p>
                        {sku.sku_code && <p className="text-xs text-slate-400">{sku.sku_code}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-mono font-semibold text-slate-700">{fmt(sku.totalUnits)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-sm font-mono text-slate-600">{sku.avgPerWeek.toFixed(0)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell">
                        <span className="text-sm text-slate-600">{sku.storeCount}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(sku.totalUnits / maxUnits) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
