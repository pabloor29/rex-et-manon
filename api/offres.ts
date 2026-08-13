import type { VercelRequest, VercelResponse } from '@vercel/node'
import { DEFAULT_OFFERS, normalizeOffers } from '../src/offers.js'
import { supabaseAdmin, OFFERS_ROW_ID } from '../src/lib/supabaseServer.js'

/** GET /api/offres — lit les offres depuis Supabase (fallback = valeurs par défaut). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Le site peut se rafraîchir vite après une édition : cache court côté CDN.
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60')

  try {
    const { data, error } = await supabaseAdmin()
      .from('offers')
      .select('zones, note, updated_at')
      .eq('id', OFFERS_ROW_ID)
      .single()

    if (error || !data) return res.status(200).json(DEFAULT_OFFERS)

    return res.status(200).json(
      normalizeOffers({ zones: data.zones, note: data.note, updatedAt: data.updated_at }),
    )
  } catch {
    return res.status(200).json(DEFAULT_OFFERS)
  }
}
