import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_FAQ, normalizeFaq, type Faq } from './faq'

const FaqCtx = createContext<Faq>(DEFAULT_FAQ)

/** FAQ du site. Défauts (exemples) jusqu'au chargement de /api/faq. */
export function useFaq(): Faq {
  return useContext(FaqCtx)
}

/** Fournit une valeur de FAQ explicite (SSR + hydratation + aperçu dans /admin). */
export function FaqValue({ value, children }: { value: Faq; children: ReactNode }) {
  return <FaqCtx.Provider value={value}>{children}</FaqCtx.Provider>
}

/** Charge la FAQ via /api/faq (utilisé en dév / rendu client-only sans SSR). */
export function FaqProvider({ children }: { children: ReactNode }) {
  const [faq, setFaq] = useState<Faq>(DEFAULT_FAQ)

  useEffect(() => {
    let alive = true
    fetch('/api/faq')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setFaq(normalizeFaq(d)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return <FaqCtx.Provider value={faq}>{children}</FaqCtx.Provider>
}
