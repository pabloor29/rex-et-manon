import type { VercelRequest, VercelResponse } from '@vercel/node'
import { normalizeOffers } from '../src/offers.js'
import { supabaseAdmin, OFFERS_ROW_ID, verifyAdmin, bearerToken } from '../src/lib/supabaseServer.js'

/**
 * POST /api/save-offres — écrit les offres dans Supabase.
 * Auth : Bearer <access_token Supabase> d'un utilisateur listé admin dans
 * rex_et_manon.profiles. Le token est revérifié côté serveur (jamais de confiance client).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = bearerToken(req.headers.authorization)
  let adminId: string | null
  try {
    adminId = await verifyAdmin(token)
  } catch (e) {
    return res.status(500).json({ error: 'Configuration serveur Supabase manquante.', detail: String(e) })
  }
  if (!adminId) {
    return res.status(401).json({ error: 'Accès refusé : connexion admin requise.' })
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) ?? {}
  const offers = normalizeOffers(body.offers)
  offers.updatedAt = new Date().toISOString()

  try {
    const { error } = await supabaseAdmin()
      .from('offers')
      .upsert({
        id: OFFERS_ROW_ID,
        zones: offers.zones,
        note: offers.note,
        updated_at: offers.updatedAt,
      })

    if (error) throw error
    return res.status(200).json({ ok: true, offers })
  } catch (e) {
    return res.status(500).json({ error: 'Échec de l’enregistrement.', detail: String(e) })
  }
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
