import { createClient } from '@supabase/supabase-js'

// Client Supabase réservé au serveur (fonctions Vercel dans api/).
// Utilise la clé service_role : ne JAMAIS l'importer depuis le bundle client.
// Ciblé sur le schéma dédié `rex_et_manon` (exposé à PostgREST).
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Configuration Supabase manquante (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).')
  }
  return createClient(url, key, {
    db: { schema: 'rex_et_manon' },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// Nom de la table document (une seule ligne, id = 1).
export const OFFERS_ROW_ID = 1

// Vérifie un access token Supabase (Bearer) et confirme que l'utilisateur est
// un admin Rex & Manon (ligne dans rex_et_manon.profiles avec role = 'admin').
// Retourne l'id utilisateur si admin, sinon null.
export async function verifyAdmin(accessToken: string): Promise<string | null> {
  if (!accessToken) return null
  const sb = supabaseAdmin()

  const { data: userData, error: userErr } = await sb.auth.getUser(accessToken)
  if (userErr || !userData.user) return null

  const { data: profile, error: profErr } = await sb
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle()

  if (profErr || !profile) return null
  return userData.user.id
}

// Extrait le token d'un header Authorization: Bearer <token>.
export function bearerToken(header: string | undefined): string {
  if (!header) return ''
  const m = /^Bearer\s+(.+)$/i.exec(header)
  return m ? m[1] : ''
}
