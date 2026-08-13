import type { VercelRequest, VercelResponse } from '@vercel/node'
import { normalizeContent } from '../src/content.js'
import { supabaseAdmin, OFFERS_ROW_ID, verifyAdmin, bearerToken, cleanupBucket } from '../src/lib/supabaseServer.js'

/**
 * POST /api/save-content — écrit le contenu du site dans Supabase.
 * Auth : Bearer <access_token Supabase> d'un admin listé dans rex_et_manon.profiles.
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
  const content = normalizeContent(body.content)
  content.updatedAt = new Date().toISOString()

  try {
    const { error } = await supabaseAdmin()
      .from('content')
      .upsert({ id: OFFERS_ROW_ID, data: content, updated_at: content.updatedAt })

    if (error) throw error
  } catch (e) {
    return res.status(500).json({ error: 'Échec de l’enregistrement.', detail: String(e) })
  }

  // Nettoyage best-effort du bucket : supprime les images désormais inutilisées
  // (remplacées ou orphelines). N'échoue jamais la sauvegarde.
  try {
    await cleanupBucket(content)
  } catch {
    /* ignore */
  }

  return res.status(200).json({ ok: true, content })
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
