import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { DEFAULT_CONTENT, normalizeContent, type SiteContent } from '../src/content.js'
import { supabaseAdmin, OFFERS_ROW_ID } from '../src/lib/supabaseServer.js'
import { themeToCssVars } from '../src/theme.js'

type SsrTarget = 'home' | 'mentions' | 'confidentialite'

// Bundle SSR auto-contenu produit par `vite build --ssr` (React inliné). Importé
// dynamiquement (chemin opaque) pour que @vercel/node ne tente pas de le compiler :
// les composants .tsx ne sont pas gérés par sa compilation d'imports.
type RenderFn = (target: SsrTarget, content: SiteContent) => string
let RENDER: RenderFn | null = null
async function loadRender(): Promise<RenderFn> {
  if (RENDER == null) {
    const mod = await import(pathToFileURL(join(process.cwd(), 'dist', 'server', 'entry-server.js')).href)
    RENDER = mod.render as RenderFn
  }
  return RENDER
}

// Template client construit par Vite (dist/index.html) — inclus dans la fonction
// via `functions.includeFiles` dans vercel.json. Lu une fois puis mis en cache.
let TEMPLATE: string | null = null
function template(): string {
  if (TEMPLATE == null) TEMPLATE = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf8')
  return TEMPLATE
}

/** Lit le contenu du site en base (même logique que /api/content). */
async function loadContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('content')
      .select('data, updated_at')
      .eq('id', OFFERS_ROW_ID)
      .single()
    if (error || !data) return DEFAULT_CONTENT
    return normalizeContent({ ...(data.data as object), updatedAt: data.updated_at })
  } catch {
    return DEFAULT_CONTENT
  }
}

function targetOf(p: unknown): SsrTarget {
  return p === 'mentions' || p === 'confidentialite' ? p : 'home'
}

const LEGAL = {
  mentions: { title: 'Mentions légales — Rex & Manon', slug: 'mentions-legales' },
  confidentialite: { title: 'Politique de confidentialité — Rex & Manon', slug: 'confidentialite' },
} as const

/**
 * SSR des pages publiques (accueil + pages légales). Rend le contenu de la base
 * dans le HTML pour le référencement, puis le client hydrate le même arbre.
 * Amélioration progressive : si le rendu échoue, on renvoie le template brut
 * (le client rendra alors le site comme avant, via /api/content).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const target = targetOf(req.query.p)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60')

  try {
    const tmpl = template()
    const [render, content] = await Promise.all([loadRender(), loadContent()])
    const appHtml = render(target, content)

    // Variables de thème (couleurs de la charte pilotées depuis l'admin) injectées
    // dès le HTML → pas de flash de couleurs avant hydratation.
    const vars = themeToCssVars(content.theme)
    const themeStyle = `<style id="theme-ssr">:root{${Object.entries(vars)
      .map(([k, v]) => `${k}:${v}`)
      .join(';')}}</style>`

    // Contenu sérialisé pour que le client hydrate exactement le même arbre.
    const dataScript = `<script>window.__SSR_CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')}</script>`

    let html = tmpl
    if (target !== 'home') {
      const { title, slug } = LEGAL[target]
      html = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://www.rexetmanon.com/${slug}" />`)
    }
    html = html
      .replace('</head>', `${themeStyle}${dataScript}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

    return res.status(200).send(html)
  } catch (err) {
    // Repli : template brut → rendu client-only (comportement d'origine).
    console.error('[ssr] fallback (rendu serveur indisponible):', err)
    try {
      return res.status(200).send(template())
    } catch {
      return res.status(500).send('Erreur serveur')
    }
  }
}
