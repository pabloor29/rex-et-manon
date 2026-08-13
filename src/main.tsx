import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import { ContentProvider } from './ContentContext.tsx'

// Routage minimal (SPA sans router). Pages hors site chargées en lazy pour ne
// pas alourdir le bundle du site public (supabase-js, textes légaux, etc.).
const Admin = lazy(() => import('./pages/Admin.tsx'))
const LegalPage = lazy(() => import('./pages/Legal.tsx'))
const path = window.location.pathname.replace(/\/+$/, '')

function Router() {
  if (path === '/admin') {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }
  if (path === '/mentions-legales' || path === '/confidentialite') {
    return (
      <ContentProvider>
        <Suspense fallback={null}>
          <LegalPage page={path === '/mentions-legales' ? 'mentions' : 'confidentialite'} />
        </Suspense>
      </ContentProvider>
    )
  }
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
    <Analytics />
  </StrictMode>,
)
