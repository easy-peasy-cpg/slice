import { createClient } from '@supabase/supabase-js'
import { aggregateDeckData } from './lib/deckHelpers.js'
import { generateReportPptx } from './lib/reportPptx.js'

export const config = {
  maxDuration: 60,
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Auth check
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token || token !== process.env.INGEST_API_SECRET) {
    return res.status(401).json({ success: false, error: 'Invalid or missing API secret' })
  }

  const { uploadId } = req.body || {}
  if (!uploadId) {
    return res.status(400).json({ success: false, error: 'Missing uploadId' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://uodumgdxerorbsctrutw.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  try {
    // Fetch upload metadata
    const { data: upload, error: uploadErr } = await supabase
      .from('slice_uploads')
      .select('*')
      .eq('id', uploadId)
      .single()

    if (uploadErr || !upload) {
      return res.status(404).json({ success: false, error: 'Upload not found' })
    }

    // Fetch user settings (brand colors, logo, company name)
    const { data: settings } = await supabase
      .from('slice_settings')
      .select('company_name, brand_primary, brand_accent, brand_font, logo_url')
      .eq('user_id', upload.user_id)
      .single()

    // Fetch all sales data for this upload (paginate if large)
    let salesData = []
    let page = 0
    const PAGE_SIZE = 1000
    while (true) {
      const { data, error } = await supabase
        .from('slice_sales')
        .select('*')
        .eq('upload_id', uploadId)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (error) throw new Error(`Sales fetch failed: ${error.message}`)
      if (!data || data.length === 0) break
      salesData.push(...data)
      if (data.length < PAGE_SIZE) break
      page++
    }

    if (salesData.length === 0) {
      return res.status(404).json({ success: false, error: 'No sales data found for this upload' })
    }

    // Generate report data
    const deckData = aggregateDeckData(salesData)

    // Generate PPTX
    const pptxBuffer = await generateReportPptx({
      deckData,
      settings: settings || {},
    })

    const companySlug = (settings?.company_name || 'Brand').replace(/\s+/g, '-').toLowerCase()
    const filename = `${companySlug}-weekly-report-WE-${upload.week_end}.pptx`

    // Return PPTX as base64
    return res.status(200).json({
      success: true,
      pptx: pptxBuffer.toString('base64'),
      filename,
      weekStart: upload.week_start,
      weekEnd: upload.week_end,
      rowCount: salesData.length,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Report generation failed: ${err.message}`,
    })
  }
}
