import { createClient } from '@supabase/supabase-js'

// Client Supabase côté navigateur (page /admin) — clé publishable (non secrète,
// OK dans le bundle). Sert uniquement au login admin ; les écritures d'offres
// passent par l'API serveur qui revérifie le JWT.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = createClient(url ?? '', key ?? '', {
  auth: { persistSession: true, autoRefreshToken: true },
})

export const supabaseConfigured = Boolean(url && key)

const PHOTOS_BUCKET = 'rex-et-manon'

/** Upload une image dans le bucket public et renvoie son URL publique. */
export async function uploadImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
  if (error) throw error
  return supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
}

/** POST JSON vers une fonction api/ avec le JWT admin courant. Throw si erreur. */
export async function authedPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Session expirée, reconnecte-toi.')
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((json as { error?: string }).error ?? `Erreur ${r.status}`)
  return json as T
}
