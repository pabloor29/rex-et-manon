import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_CONTENT, normalizeContent, type SiteContent } from './content'
import { applyTheme } from './theme'

const ContentCtx = createContext<SiteContent>(DEFAULT_CONTENT)

/** Contenu du site (textes). Défauts jusqu'au chargement de /api/content. */
export function useContent(): SiteContent {
  return useContext(ContentCtx)
}

/** Fournit une valeur de contenu explicite (utilisé pour l'aperçu dans /admin). */
export function ContentValue({ value, children }: { value: SiteContent; children: ReactNode }) {
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  useEffect(() => {
    let alive = true
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return
        const c = normalizeContent(d)
        setContent(c)
        applyTheme(c.theme)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return <ContentCtx.Provider value={content}>{children}</ContentCtx.Provider>
}
