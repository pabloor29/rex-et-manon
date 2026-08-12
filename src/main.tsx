import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import { ContentProvider } from './ContentContext.tsx'

// Routage minimal (SPA sans router) : /admin → éditeur, sinon le site.
// Admin chargé en lazy → supabase-js n'alourdit pas le bundle du site public.
const Admin = lazy(() => import('./pages/Admin.tsx'))
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <ContentProvider>
        <App />
      </ContentProvider>
    )}
    <Analytics />
  </StrictMode>,
)
