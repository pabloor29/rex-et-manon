import type { VercelRequest, VercelResponse } from '@vercel/node'
import { DEFAULT_CONTENT, normalizeContent } from '../src/content.js'
import { supabaseAdmin, OFFERS_ROW_ID } from '../src/lib/supabaseServer.js'

/** GET /api/content — lit le contenu du site depuis Supabase (fallback = défauts). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60')

  try {
    const { data, error } = await supabaseAdmin()
      .from('content')
      .select('data, updated_at')
      .eq('id', OFFERS_ROW_ID)
      .single()

    if (error || !data) return res.status(200).json(DEFAULT_CONTENT)

    return res.status(200).json(
      normalizeContent({ ...(data.data as object), updatedAt: data.updated_at }),
    )
  } catch {
    return res.status(200).json(DEFAULT_CONTENT)
  }
}
