import { StrictMode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import LegalPage from './pages/Legal'
import { ContentValue } from './ContentContext'
import { FaqValue } from './FaqContext'
import type { SiteContent } from './content'
import { DEFAULT_FAQ, type Faq } from './faq'

// Cibles rendues par le serveur (SSR) ET hydratées par le client. Le même arbre
// est produit des deux côtés pour garantir une hydratation sans écart.
export type SsrTarget = 'home' | 'mentions' | 'confidentialite'

/**
 * Arbre React partagé entre le rendu serveur (entry-server) et l'hydratation
 * client (entry-client). Le contenu est fourni explicitement (déjà lu en base) —
 * pas de fetch ici, donc rendu serveur et premier rendu client sont identiques.
 */
export function AppShell({
  target,
  content,
  faq = DEFAULT_FAQ,
}: {
  target: SsrTarget
  content: SiteContent
  faq?: Faq
}) {
  const view =
    target === 'home' ? (
      <App />
    ) : (
      <LegalPage page={target === 'mentions' ? 'mentions' : 'confidentialite'} />
    )
  return (
    <StrictMode>
      <ContentValue value={content}>
        <FaqValue value={faq}>{view}</FaqValue>
      </ContentValue>
      <Analytics />
    </StrictMode>
  )
}
