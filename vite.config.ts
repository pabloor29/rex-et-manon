import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  // Build SSR (vite build --ssr) : tout inliner (React inclus) pour produire un
  // bundle serveur auto-contenu, importable par la fonction Vercel api/ssr sans
  // dépendre du node_modules du lambda.
  ssr: {
    noExternal: true,
  },
  build: {
    // Pas besoin de recopier public/ (images, brand…) dans le bundle serveur.
    copyPublicDir: !isSsrBuild,
  },
}))
