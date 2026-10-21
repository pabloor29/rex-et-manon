import type { VercelRequest, VercelResponse } from '@vercel/node'
import { DEFAULT_FAQ, normalizeFaq } from '../src/faq.js'
import { supabaseAdmin, OFFERS_ROW_ID } from '../src/lib/supabaseServer.js'

/** GET /api/faq — lit la FAQ depuis Supabase (fallback = exemples par défaut). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Le site peut se rafraîchir vite après une édition : cache court côté CDN.
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60')

  try {
    const { data, error } = await supabaseAdmin()
      .from('faq')
      .select('items, updated_at')
      .eq('id', OFFERS_ROW_ID)
      .single()

    // Ligne semée vide (items = []) → on renvoie les exemples par défaut.
    if (error || !data || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(200).json(DEFAULT_FAQ)
    }

    return res.status(200).json(normalizeFaq({ items: data.items, updatedAt: data.updated_at }))
  } catch {
    return res.status(200).json(DEFAULT_FAQ)
  }
}
