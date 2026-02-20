import { useSlice } from '../context/SliceContext'

const fmt = (n) => new Intl.NumberFormat('en-US').format(n)

function getWeeklyTotals(salesReports) {
  const byWeek = {}
  for (const r of salesReports) {
    byWeek[r.week_start] = (byWeek[r.week_start] || 0) + (r.units_sold ?? 0)
  }
  return Object.entries(byWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
}

function getTopSkus(salesReports, skus, n = 5) {
  const totals = {}
  for (const r of salesReports) {
    totals[r.sku_id] = (totals[r.sku_id] || 0) + (r.units_sold ?? 0)
  }
  const skuMap = new Map(skus.map((s) => [s.id, s]))
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([id, units]) => ({ sku: skuMap.get(id), units }))
    .filter((x) => x.sku)
}

function getWeekOverWeekChange(salesReports) {
  const byWeek = {}
  for (const r of salesReports) {
    byWeek[r.week_start] = (byWeek[r.week_start] || 0) + (r.units_sold ?? 0)
  }
  const weeks = Object.keys(byWeek).sort()
  if (weeks.length < 2) return null
  const thisWeek = byWeek[weeks[weeks.length - 1]]
  const lastWeek = byWeek[weeks[weeks.length - 2]]
  if (!lastWeek) return null
  return ((thisWeek - lastWeek) / lastWeek) * 100
}

export default function Dashboard() {
  const { skus, stores, salesReports, loading } = useSlice()

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

  const totalUnitsAllTime = salesReports.reduce((s, r) => s + (r.units_sold ?? 0), 0)
  const weeklyData = getWeeklyTotals(salesReports)
  const currentWeekUnits = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1][1] : 0
  const wowChange = getWeekOverWeekChange(salesReports)
  const topSkus = getTopSkus(salesReports, skus)
  const maxSkuUnits = topSkus[0]?.units || 1

  const now = new Date()
  const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  // Empty state
  if (salesReports.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{monthLabel}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-800 font-semibold mb-1">No sales data yet</p>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Add your SKUs and stores, then start uploading weekly sales reports to see your retail velocity here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">{monthLabel}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-t-2 border-t-emerald-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">This Week</p>
          <p className="text-2xl font-mono font-semibold text-slate-800 mt-2">{fmt(currentWeekUnits)}</p>
          <p className="text-xs text-slate-400 mt-1">units sold</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-t-2 border-t-indigo-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Week-over-Week</p>
          <p className={`text-2xl font-mono font-semibold mt-2 ${wowChange === null ? 'text-slate-400' : wowChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {wowChange === null ? '—' : `${wowChange >= 0 ? '+' : ''}${wowChange.toFixed(1)}%`}
          </p>
          <p className="text-xs text-slate-400 mt-1">vs. last week</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-t-2 border-t-slate-400">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active SKUs</p>
          <p className="text-2xl font-mono font-semibold text-slate-800 mt-2">{skus.length}</p>
          <p className="text-xs text-slate-400 mt-1">tracked products</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-t-2 border-t-blue-400">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stores</p>
          <p className="text-2xl font-mono font-semibold text-slate-800 mt-2">{stores.length}</p>
          <p className="text-xs text-slate-400 mt-1">retail doors</p>
        </div>
      </div>

      {/* Weekly trend */}
      {weeklyData.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Weekly Velocity</h2>
          <div className="flex items-end gap-2" style={{ height: '80px' }}>
            {weeklyData.map(([week, units]) => {
              const maxUnits = Math.max(...weeklyData.map(([, u]) => u), 1)
              const pct = (units / maxUnits) * 100
              const label = new Date(week + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative group w-full flex flex-col items-center">
                    <div
                      className="w-full rounded-t-sm bg-emerald-500 transition-all"
                      style={{ height: `${(pct / 100) * 68}px`, minHeight: '4px' }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {fmt(units)} units
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Top SKUs */}
      {topSkus.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800">Top SKUs by Volume</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {topSkus.map(({ sku, units }, i) => (
              <div key={sku.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-xs font-mono text-slate-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{sku.name}</p>
                  {sku.sku_code && (
                    <p className="text-xs text-slate-400">{sku.sku_code}</p>
                  )}
                </div>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(units / maxSkuUnits) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-semibold text-slate-700 w-16 text-right">
                  {fmt(units)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
