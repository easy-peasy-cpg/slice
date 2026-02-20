import { useSlice } from '../context/SliceContext'

const fmt = (n) => new Intl.NumberFormat('en-US').format(n)

const RETAILER_COLORS = {
  'Whole Foods': 'bg-emerald-50 text-emerald-700',
  'Sprouts': 'bg-green-50 text-green-700',
  'Natural Grocers': 'bg-lime-50 text-lime-700',
  'Wegmans': 'bg-blue-50 text-blue-700',
  'HEB': 'bg-orange-50 text-orange-700',
}

function getStoreStats(salesReports, stores) {
  const totals = {}
  for (const r of salesReports) {
    if (!totals[r.store_id]) totals[r.store_id] = { total: 0, skus: new Set() }
    totals[r.store_id].total += r.units_sold ?? 0
    totals[r.store_id].skus.add(r.sku_id)
  }

  return stores.map((store) => {
    const stat = totals[store.id] || { total: 0, skus: new Set() }
    return {
      ...store,
      totalUnits: stat.total,
      skuCount: stat.skus.size,
    }
  })
}

export default function Stores() {
  const { stores, salesReports, loading } = useSlice()

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

  const storeStats = getStoreStats(salesReports, stores)
    .sort((a, b) => b.totalUnits - a.totalUnits)
  const maxUnits = Math.max(...storeStats.map((s) => s.totalUnits), 1)

  // Group by retailer
  const byRetailer = {}
  for (const store of storeStats) {
    const r = store.retailer || 'Other'
    if (!byRetailer[r]) byRetailer[r] = []
    byRetailer[r].push(store)
  }

  const retailerTotals = Object.entries(byRetailer)
    .map(([name, stores]) => ({
      name,
      total: stores.reduce((s, st) => s + st.totalUnits, 0),
      count: stores.length,
    }))
    .sort((a, b) => b.total - a.total)

  if (stores.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Stores</h1>
          <p className="text-slate-500 text-sm mt-1">Retail door performance</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-slate-800 font-semibold mb-1">No stores yet</p>
          <p className="text-slate-400 text-sm">Add your retail doors to track store-level performance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Stores</h1>
        <p className="text-slate-500 text-sm mt-1">Retail door performance across {stores.length} locations</p>
      </div>

      {/* Retailer summary cards */}
      {retailerTotals.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {retailerTotals.map((r) => (
            <div key={r.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-t-2 border-t-emerald-500">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${RETAILER_COLORS[r.name] || 'bg-slate-100 text-slate-600'}`}
                >
                  {r.name}
                </span>
                <span className="text-xs text-slate-400">{r.count} {r.count === 1 ? 'door' : 'doors'}</span>
              </div>
              <p className="text-2xl font-mono font-semibold text-slate-800">{fmt(r.total)}</p>
              <p className="text-xs text-slate-400 mt-1">total units sold</p>
            </div>
          ))}
        </div>
      )}

      {/* Store table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">All Doors</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Store</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Retailer</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Units</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">SKUs</th>
              <th className="px-5 py-3 hidden lg:table-cell w-40"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {storeStats.map((store) => (
              <tr key={store.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-slate-800">{store.name}</p>
                  {store.location && <p className="text-xs text-slate-400">{store.location}</p>}
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  {store.retailer ? (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RETAILER_COLORS[store.retailer] || 'bg-slate-100 text-slate-600'}`}>
                      {store.retailer}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-mono font-semibold text-slate-700">{fmt(store.totalUnits)}</span>
                </td>
                <td className="px-5 py-3.5 text-right hidden md:table-cell">
                  <span className="text-sm text-slate-600">{store.skuCount}</span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(store.totalUnits / maxUnits) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
