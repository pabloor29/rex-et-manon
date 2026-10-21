import type { VercelRequest, VercelResponse } from '@vercel/node'
import { normalizeFaq } from '../src/faq.js'
import { supabaseAdmin, OFFERS_ROW_ID, verifyAdmin, bearerToken } from '../src/lib/supabaseServer.js'

/**
 * POST /api/save-faq — écrit la FAQ dans Supabase.
 * Auth : Bearer <access_token Supabase> d'un admin listé dans rex_et_manon.profiles.
 * Le token est revérifié côté serveur (jamais de confiance client).
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
  const faq = normalizeFaq(body.faq)
  // On ne garde que les entrées réellement remplies (question + réponse non vides).
  faq.items = faq.items.filter((it) => it.question.trim() && it.answer.trim())
  faq.updatedAt = new Date().toISOString()

  try {
    const { error } = await supabaseAdmin()
      .from('faq')
      .upsert({ id: OFFERS_ROW_ID, items: faq.items, updated_at: faq.updatedAt })

    if (error) throw error
    return res.status(200).json({ ok: true, faq })
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
