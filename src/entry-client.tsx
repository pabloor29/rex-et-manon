import { StrictMode, Suspense, lazy } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import { AppShell, type SsrTarget } from './AppShell'
import { ContentProvider } from './ContentContext'
import { FaqProvider } from './FaqContext'
import { normalizeContent } from './content'
import { normalizeFaq } from './faq'
import { applyTheme } from './theme'
import App from './App'
import LegalPage from './pages/Legal'

// /admin reste client-only (charge supabase-js à la demande) — jamais rendu côté serveur.
const Admin = lazy(() => import('./pages/Admin'))

const path = window.location.pathname.replace(/\/+$/, '')
const root = document.getElementById('root')!

function targetFor(p: string): SsrTarget {
  if (p === '/mentions-legales') return 'mentions'
  if (p === '/confidentialite') return 'confidentialite'
  return 'home'
}

if (path === '/admin') {
  // Aucun HTML pré-rendu : rendu client classique.
  createRoot(root).render(
    <StrictMode>
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
      <Analytics />
    </StrictMode>,
  )
} else {
  const injected = window.__SSR_CONTENT__
  const target = targetFor(path)
  if (injected) {
    // Prod : le serveur a rendu le HTML avec ce contenu → on hydrate le même arbre.
    const content = normalizeContent(injected)
    const faq = normalizeFaq(window.__SSR_FAQ__)
    applyTheme(content.theme)
    hydrateRoot(root, <AppShell target={target} content={content} faq={faq} />)
  } else {
    // Dév / pas de SSR (vite dev) : rendu client-only, contenu chargé via /api/content et /api/faq.
    const view =
      target === 'home' ? (
        <App />
      ) : (
        <LegalPage page={target === 'mentions' ? 'mentions' : 'confidentialite'} />
      )
    createRoot(root).render(
      <StrictMode>
        <ContentProvider>
          <FaqProvider>{view}</FaqProvider>
        </ContentProvider>
        <Analytics />
      </StrictMode>,
    )
  }
}
