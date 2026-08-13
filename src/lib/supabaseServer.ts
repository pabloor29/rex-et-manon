import { createClient } from '@supabase/supabase-js'
import { WebSocket as WS } from 'ws'

// @supabase/supabase-js (realtime-js) exige un WebSocket global. Node 22+ en
// fournit un nativement (comme le runtime Vercel prod, Node 24). En dev local
// sous Node < 22, il est absent → createClient throw. On polyfill via `ws`.
// Sans effet quand WebSocket natif existe déjà.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === 'undefined') {
  ;(globalThis as { WebSocket?: unknown }).WebSocket = WS
}

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

// Bucket public des images uploadées depuis l'admin.
export const PHOTOS_BUCKET = 'rex-et-manon'

/**
 * Nettoie le bucket : supprime toute image qui n'est plus référencée dans le
 * `content` fourni (couvre le remplacement d'une image et purge les orphelines).
 * Best-effort — l'appelant ne doit pas échouer si ça throw.
 */
export async function cleanupBucket(content: unknown): Promise<{ deleted: string[] }> {
  const url = process.env.SUPABASE_URL
  if (!url) return { deleted: [] }
  const sb = supabaseAdmin()
  const prefix = `${url}/storage/v1/object/public/${PHOTOS_BUCKET}/`

  // Noms d'objets référencés dans le contenu (URLs pointant vers ce bucket).
  const used = new Set<string>()
  const re = new RegExp(prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^"\\s?]+)', 'g')
  const json = JSON.stringify(content)
  let m: RegExpExecArray | null
  while ((m = re.exec(json))) used.add(decodeURIComponent(m[1]))

  const { data: objects, error } = await sb.storage.from(PHOTOS_BUCKET).list('', { limit: 1000 })
  if (error || !objects) return { deleted: [] }

  const toDelete = objects.map((o) => o.name).filter((n) => n && !used.has(n))
  if (toDelete.length) {
    const { error: delErr } = await sb.storage.from(PHOTOS_BUCKET).remove(toDelete)
    if (delErr) return { deleted: [] }
  }
  return { deleted: toDelete }
}

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
