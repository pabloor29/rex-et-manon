import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { DEFAULT_CONTENT, normalizeContent, type SiteContent } from '../src/content.js'
import { DEFAULT_FAQ, normalizeFaq, type Faq } from '../src/faq.js'
import { supabaseAdmin, OFFERS_ROW_ID } from '../src/lib/supabaseServer.js'
import { themeToCssVars } from '../src/theme.js'

type SsrTarget = 'home' | 'mentions' | 'confidentialite'

// Bundle SSR auto-contenu produit par `vite build --ssr` (React inliné). Importé
// dynamiquement (chemin opaque) pour que @vercel/node ne tente pas de le compiler :
// les composants .tsx ne sont pas gérés par sa compilation d'imports.
type RenderFn = (target: SsrTarget, content: SiteContent, faq: Faq) => string
let RENDER: RenderFn | null = null
async function loadRender(): Promise<RenderFn> {
  if (RENDER == null) {
    const mod = await import(pathToFileURL(join(process.cwd(), '.ssr', 'entry-server.js')).href)
    RENDER = mod.render as RenderFn
  }
  return RENDER
}

// Shell HTML construit par Vite puis déplacé hors de dist/ (sinon il serait servi
// statiquement sur `/`, ce qui court-circuiterait ce rewrite). Inclus dans la
// fonction via `functions.includeFiles`. Lu une fois puis mis en cache.
let TEMPLATE: string | null = null
function template(): string {
  if (TEMPLATE == null) TEMPLATE = readFileSync(join(process.cwd(), '.ssr', 'template.html'), 'utf8')
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

/** Lit la FAQ en base (même logique que /api/faq ; ligne vide → exemples par défaut). */
async function loadFaq(): Promise<Faq> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('faq')
      .select('items, updated_at')
      .eq('id', OFFERS_ROW_ID)
      .single()
    if (error || !data || !Array.isArray(data.items) || data.items.length === 0) return DEFAULT_FAQ
    return normalizeFaq({ items: data.items, updatedAt: data.updated_at })
  } catch {
    return DEFAULT_FAQ
  }
}

/** Balisage JSON-LD FAQPage pour le référencement (données structurées Google). */
function faqJsonLd(faq: Faq): string {
  if (!faq.items.length) return ''
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }
  return `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`
}

function targetOf(p: unknown): SsrTarget | null {
  if (p === 'home' || p === 'mentions' || p === 'confidentialite') return p
  return null // route sans SSR (admin, inconnue) → shell brut
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

  // Routes sans SSR (admin, chemins inconnus) : shell brut, le client rend l'app.
  if (target == null) {
    try {
      return res.status(200).send(template())
    } catch (err) {
      console.error('[ssr] shell introuvable:', err)
      return res.status(500).send('Erreur serveur')
    }
  }

  try {
    const tmpl = template()
    const [render, content, faq] = await Promise.all([loadRender(), loadContent(), loadFaq()])
    const appHtml = render(target, content, faq)

    // Variables de thème (couleurs de la charte pilotées depuis l'admin) injectées
    // dès le HTML → pas de flash de couleurs avant hydratation.
    const vars = themeToCssVars(content.theme)
    const themeStyle = `<style id="theme-ssr">:root{${Object.entries(vars)
      .map(([k, v]) => `${k}:${v}`)
      .join(';')}}</style>`

    // Contenu + FAQ sérialisés pour que le client hydrate exactement le même arbre.
    const dataScript =
      `<script>window.__SSR_CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')};` +
      `window.__SSR_FAQ__=${JSON.stringify(faq).replace(/</g, '\\u003c')}</script>`

    // Données structurées FAQPage uniquement sur l'accueil (où la FAQ est rendue).
    const faqSchema = target === 'home' ? faqJsonLd(faq) : ''

    let html = tmpl
    if (target !== 'home') {
      const { title, slug } = LEGAL[target]
      html = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://www.rexetmanon.com/${slug}" />`)
    }
    html = html
      .replace('</head>', `${themeStyle}${dataScript}${faqSchema}</head>`)
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
