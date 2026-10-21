/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Contenu du site + FAQ injectés par le SSR (api/ssr) pour une hydratation sans écart.
interface Window {
  __SSR_CONTENT__?: unknown
  __SSR_FAQ__?: unknown
}
