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

/**
 * Convertit une image raster en WebP via <canvas>, avec redimensionnement
 * facultatif (borne le plus grand côté). Les SVG (vectoriels) sont renvoyés
 * tels quels. Renvoie le Blob WebP (ou le fichier d'origine si non convertible).
 */
async function toWebp(file: File, maxDim = 2000, quality = 0.85): Promise<Blob> {
  if (file.type === 'image/webp' || file.type === 'image/svg+xml') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  )
  return blob ?? file
}

/** Upload une image dans le bucket public (convertie en WebP) et renvoie son URL publique. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await toWebp(file)
  const isWebp = blob.type === 'image/webp'
  const ext = isWebp ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, blob, { cacheControl: '31536000', upsert: false, contentType: blob.type || file.type })
  if (error) throw error
  return supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Demande au serveur si l'utilisateur courant est autorisé à l'admin
 * (présent dans rex_et_manon.profiles avec role = 'admin'). Vérif autoritative
 * côté serveur — ne pas se fier au seul fait d'avoir une session Supabase Auth.
 */
export async function fetchIsAdmin(): Promise<boolean> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return false
  try {
    const r = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } })
    if (!r.ok) return false
    const json = (await r.json().catch(() => ({}))) as { admin?: boolean }
    return Boolean(json.admin)
  } catch {
    return false
  }
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
