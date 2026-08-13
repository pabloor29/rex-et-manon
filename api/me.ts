import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyAdmin, bearerToken } from '../src/lib/supabaseServer.js'

/**
 * GET /api/me — indique si l'utilisateur connecté est autorisé à l'admin,
 * c.-à-d. présent dans rex_et_manon.profiles avec role = 'admin'.
 * Auth : Bearer <access_token Supabase>. Vérifié côté serveur (service_role).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = bearerToken(req.headers.authorization)
  try {
    const adminId = await verifyAdmin(token)
    return res.status(200).json({ admin: Boolean(adminId) })
  } catch (e) {
    // Fail-closed : en cas d'erreur serveur, on refuse l'accès.
    return res.status(200).json({ admin: false, detail: String(e) })
  }
}
