import PptxGenJS from 'pptxgenjs'

function formatCompactCurrency(value) {
  if (value == null || isNaN(value)) return '$0'
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function formatCompactNumber(value) {
  if (value == null || isNaN(value)) return '0'
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(Math.round(value))
}

function formatNumber(value) {
  if (value == null || isNaN(value)) return '0'
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Generate a branded Category Review PPTX deck server-side.
 * Returns a Buffer with the .pptx file contents.
 */
export async function generateReportPptx({ deckData, settings }) {
  const pptx = new PptxGenJS()
  const primary = settings.brand_primary || '#1e4845'
  const accent = settings.brand_accent || '#cbd97f'
  const fontColor = settings.brand_font || '#ffffff'
  const primaryHex = primary.replace('#', '')
  const accentHex = accent.replace('#', '')
  const fontHex = fontColor.replace('#', '')
  const companyName = settings.company_name || 'Category Review'
  const { stats, weeklyTrend, allRegions, topStores, velocityItems, dateRange } = deckData

  pptx.author = companyName
  pptx.title = `${companyName} - Weekly Report`

  const addHeader = (slide, title) => {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.7, fill: { color: primaryHex } })
    if (settings.logo_url) {
      try {
        slide.addImage({ path: settings.logo_url, x: 0.4, y: 0.12, h: 0.45, w: 0.45, rounding: true })
      } catch (_) { /* logo fetch can fail in serverless */ }
    }
    slide.addText(title, { x: settings.logo_url ? 1.0 : 0.4, y: 0.15, fontSize: 18, color: fontHex, bold: true })
  }

  const addFooter = (slide) => {
    slide.addText('Powered by Slice', { x: 0.4, y: 5.2, fontSize: 8, color: '94A3B8' })
  }

  // --- Slide 1: Title ---
  const s1 = pptx.addSlide()
  s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: primaryHex } })
  if (settings.logo_url) {
    try {
      s1.addImage({ path: settings.logo_url, x: 3.8, y: 1.0, h: 1.2, w: 1.2 })
    } catch (_) {}
  }
  s1.addText(companyName, { x: 0.5, y: settings.logo_url ? 2.4 : 1.5, w: 9, fontSize: 32, color: fontHex, bold: true, align: 'center' })
  s1.addText('Weekly Report', { x: 0.5, y: settings.logo_url ? 3.1 : 2.3, w: 9, fontSize: 20, color: accentHex, align: 'center' })
  s1.addText(`${formatDateShort(dateRange.start)} — ${formatDateShort(dateRange.end)}`, { x: 0.5, y: settings.logo_url ? 3.7 : 3.0, w: 9, fontSize: 14, color: fontHex, align: 'center', italic: true })
  s1.addText('Whole Foods Market', { x: 0.5, y: settings.logo_url ? 4.1 : 3.4, w: 9, fontSize: 12, color: accentHex, align: 'center' })
  addFooter(s1)

  // --- Slide 2: Business Overview ---
  const s2 = pptx.addSlide()
  addHeader(s2, 'Business Overview')
  const metrics = [
    { label: 'Net Sales', value: formatCompactCurrency(stats.totalNetSales), yoy: stats.salesYoy },
    { label: 'Unit Sales', value: formatCompactNumber(stats.totalUnits), yoy: stats.unitsYoy },
    { label: 'Avg Retail', value: formatCompactCurrency(stats.avgRetail), yoy: stats.avgRetailYoy },
    { label: 'Active Stores', value: formatNumber(stats.uniqueStores) },
  ]
  metrics.forEach((m, i) => {
    const x = 0.4 + i * 2.3
    s2.addShape(pptx.ShapeType.roundRect, { x, y: 1.2, w: 2.0, h: 1.5, fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.08 })
    s2.addText(m.label, { x, y: 1.35, w: 2.0, fontSize: 9, color: '64748B', align: 'center', bold: true })
    s2.addText(m.value, { x, y: 1.7, w: 2.0, fontSize: 24, color: '1E293B', bold: true, align: 'center' })
    if (m.yoy != null) {
      const yoyColor = m.yoy >= 0 ? '166534' : 'DC2626'
      const yoyText = `${m.yoy >= 0 ? '+' : ''}${m.yoy.toFixed(1)}% YOY`
      s2.addText(yoyText, { x, y: 2.2, w: 2.0, fontSize: 10, color: yoyColor, align: 'center' })
    }
  })
  addFooter(s2)

  // --- Slide 3: Sales Trends ---
  const s3 = pptx.addSlide()
  addHeader(s3, 'Sales Trends')
  const chartData = weeklyTrend.map(w => ({
    name: formatDateShort(w.week_ending),
    inStore: w.inStore,
    online: w.online,
  }))
  s3.addChart(pptx.charts.LINE, [
    { name: 'In-Store', labels: chartData.map(d => d.name), values: chartData.map(d => d.inStore) },
    { name: 'Online', labels: chartData.map(d => d.name), values: chartData.map(d => d.online) },
  ], {
    x: 0.5, y: 1.0, w: 9.0, h: 3.8,
    showLegend: true, legendPos: 'b', legendFontSize: 9,
    lineDataSymbol: 'none', lineSmooth: true,
    valAxisNumFmt: '$#,##0,K',
    chartColors: [primaryHex, accentHex],
  })
  addFooter(s3)

  // --- Slide 4: Regional Performance ---
  const s4 = pptx.addSlide()
  addHeader(s4, 'Regional Performance')
  const regionRows = allRegions.map(r => {
    const yoy = r.salesLY > 0 ? ((r.sales - r.salesLY) / r.salesLY * 100) : 0
    return [r.name, formatCompactCurrency(r.sales), formatCompactNumber(r.units), `${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}%`]
  })
  s4.addTable(
    [
      [
        { text: 'Region', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Sales', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Units', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'YOY', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
      ],
      ...regionRows.map(row => row.map(cell => ({ text: cell, options: { fontSize: 9 } }))),
    ],
    { x: 0.5, y: 1.0, w: 9.0, border: { pt: 0.5, color: 'E2E8F0' }, colW: [3.5, 2.0, 1.8, 1.7] }
  )
  addFooter(s4)

  // --- Slide 5: Top 10 Stores ---
  const s5 = pptx.addSlide()
  addHeader(s5, 'Top 10 Stores')
  const storeRows = topStores.map((s, i) => {
    const yoy = s.salesLY > 0 ? ((s.sales - s.salesLY) / s.salesLY * 100) : 0
    return [`${i + 1}`, s.storeName, s.region, formatCompactCurrency(s.sales), formatCompactNumber(s.units), `${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}%`]
  })
  s5.addTable(
    [
      [
        { text: '#', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Store', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Region', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Sales', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Units', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'YOY', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
      ],
      ...storeRows.map((row, i) => row.map(cell => ({ text: cell, options: { fontSize: 9, fill: { color: i % 2 === 0 ? 'FFFFFF' : 'F8FAFC' } } }))),
    ],
    { x: 0.5, y: 1.0, w: 9.0, border: { pt: 0.5, color: 'E2E8F0' }, colW: [0.5, 2.8, 2.0, 1.3, 1.2, 1.2] }
  )
  addFooter(s5)

  // --- Slide 6: Item Performance ---
  const s6 = pptx.addSlide()
  addHeader(s6, 'Item Performance')
  const topItems = velocityItems.slice(0, 10)
  const itemRows = topItems.map((v, i) => [
    `${i + 1}`,
    v.item,
    `${v.velocity.toFixed(1)}`,
    formatNumber(v.storesWithSales),
    formatCompactNumber(v.unitSales),
  ])
  s6.addTable(
    [
      [
        { text: '#', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Item', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Velocity (u/s/w)', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Stores', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
        { text: 'Units', options: { bold: true, fontSize: 10, color: fontHex, fill: { color: primaryHex } } },
      ],
      ...itemRows.map((row, i) => row.map(cell => ({ text: cell, options: { fontSize: 9, fill: { color: i % 2 === 0 ? 'FFFFFF' : 'F8FAFC' } } }))),
    ],
    { x: 0.5, y: 1.0, w: 9.0, border: { pt: 0.5, color: 'E2E8F0' }, colW: [0.5, 3.5, 2.0, 1.5, 1.5] }
  )
  addFooter(s6)

  // Generate as buffer (Node.js)
  const output = await pptx.write({ outputType: 'nodebuffer' })
  return output
}
