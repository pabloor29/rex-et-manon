import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Plugin DEV uniquement : exécute les fonctions `api/*.ts` directement dans le
 * serveur Vite (`npm run dev`), avec les variables de `.env.local` chargées dans
 * `process.env`. Remplace `vercel dev` (CLI natif instable) pour tester l'admin,
 * les sauvegardes et les endpoints en local. N'affecte jamais le build de prod.
 */
function devApi(): Plugin {
  const apiDir = resolve(__dirname, 'api')
  return {
    name: 'dev-api',
    apply: 'serve',
    // Les fonctions importent `../src/x.js` (convention Vercel) alors que la source
    // est `x.ts`. En dev, on redirige ces imports `.js` → `.ts` quand le fichier existe.
    resolveId(source, importer) {
      if (importer && (source.startsWith('./') || source.startsWith('../')) && source.endsWith('.js')) {
        const ts = resolve(dirname(importer), source).replace(/\.js$/, '.ts')
        if (existsSync(ts)) return ts
      }
      return null
    },
    configureServer(server) {
      // Charge toutes les variables (.env, .env.local, …) côté serveur, y compris
      // les secrets serveur (SUPABASE_SERVICE_ROLE_KEY) non préfixés VITE_.
      const env = loadEnv('development', __dirname, '')
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const rawUrl = req.url || ''
        if (!rawUrl.startsWith('/api/')) return next()

        const url = new URL(rawUrl, 'http://localhost')
        const name = url.pathname.replace(/^\/api\//, '').replace(/\/+$/, '')
        const file = resolve(apiDir, `${name}.ts`)
        if (!name || !existsSync(file) || !file.startsWith(apiDir)) return next()

        // Corps JSON pour les écritures.
        let body: unknown
        if (req.method && !['GET', 'HEAD'].includes(req.method)) {
          const chunks: Uint8Array[] = []
          for await (const c of req) chunks.push(c as Uint8Array)
          const raw = Buffer.concat(chunks).toString('utf8')
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = raw
          }
        }

        const query: Record<string, string> = {}
        url.searchParams.forEach((v, k) => (query[k] = v))

        // Adapte la réponse Node au minimum de l'API VercelResponse utilisée.
        const vres = res as ServerResponse & {
          status: (c: number) => typeof vres
          json: (o: unknown) => void
          send: (b: unknown) => void
        }
        vres.status = (c: number) => {
          res.statusCode = c
          return vres
        }
        vres.json = (o: unknown) => {
          if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(o))
        }
        vres.send = (b: unknown) => res.end(typeof b === 'string' || Buffer.isBuffer(b) ? b : JSON.stringify(b))

        const vreq = Object.assign(req, { query, body, cookies: {} })

        try {
          const mod = await server.ssrLoadModule(file)
          await (mod.default as (q: unknown, s: unknown) => unknown)(vreq, vres)
        } catch (e) {
          server.config.logger.error(`[dev-api] ${name}: ${e instanceof Error ? e.stack : String(e)}`)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(JSON.stringify({ error: 'dev-api error', detail: String(e) }))
        }
      })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), devApi()],
  // Build SSR (vite build --ssr) : tout inliner (React inclus) pour produire un
  // bundle serveur auto-contenu, importable par la fonction Vercel api/ssr sans
  // dépendre du node_modules du lambda. En dev (serve), on garde l'externalisation
  // par défaut pour que les deps CJS (ws, supabase-js) chargées par les fonctions
  // `api/` via le plugin dev-api fonctionnent (sinon `require is not defined`).
  ssr: {
    noExternal: isSsrBuild ? true : undefined,
  },
  build: {
    // Pas besoin de recopier public/ (images, brand…) dans le bundle serveur.
    copyPublicDir: !isSsrBuild,
  },
}))
