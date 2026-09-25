import { renderToString } from 'react-dom/server'
import { AppShell, type SsrTarget } from './AppShell'
import type { SiteContent } from './content'

/**
 * Rend l'arbre public en HTML côté serveur (fonction Vercel api/ssr).
 * N'importe PAS index.css ni le client Supabase navigateur : uniquement du HTML.
 */
export function render(target: SsrTarget, content: SiteContent): string {
  return renderToString(<AppShell target={target} content={content} />)
}

export type { SsrTarget }
