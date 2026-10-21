# Rex & Manon 🐾

One-page vitrine pour **Manon Berthier** — balades éducatives canines à Carcassonne.

Stack : **React 18 + TypeScript + Vite 6 + Tailwind CSS v4**, hébergement **Vercel** (fonctions serverless + rendu SSR), données & admin sur **Supabase** (schéma `rex_et_manon`).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build
```

> En `dev`/`preview` local, les fonctions `/api` ne tournent pas : la page tarifs et `/admin`
> retombent sur les valeurs par défaut (`src/offers.ts`). Pour tester l'API en local : `vercel dev`.

## Structure

- `src/App.tsx` — assemble les sections du site
- `src/components/` — `Navbar`, `Hero`, `About`, `Feature`, `Services`, `Gallery`, `Zones`, `Contact`, `Footer`, `Scallop`, `TennisBall`
- `src/pages/Admin.tsx` — page `/admin` d'édition des offres
- `src/offers.ts` — modèle + valeurs par défaut des offres (partagé site / admin / API)
- `api/offres.ts` — lecture des offres (Vercel Blob)
- `api/save-offres.ts` — écriture des offres (mot de passe requis)
- `public/img/photos/` — photos web optimisées · `public/brand/` — logos & balle (charte)
- `identite-visuelle/` — charte source (hors build) · `photos-sources/` — photos HD (hors build, gitignored)
- `src/index.css` — thème Tailwind : **palette exacte de la charte** (#FD5900, #FEEAD4, #AACF31, #005A2F), polices **Nunito** (corps) + **Fredoka** (titres, approximation d'Intro Rust)

## Admin — éditer les tarifs sans base de données

La page **`/admin`** permet à Manon de modifier ses secteurs, tarifs et notes. Les offres sont
stockées en JSON dans **Vercel Blob** (pas de SQL) et relues par le site via `/api/offres`.

### Mise en place sur Vercel (une seule fois)

1. **Blob** : Dashboard Vercel → projet → **Storage → Create → Blob**. Vercel ajoute
   automatiquement la variable d'environnement `BLOB_READ_WRITE_TOKEN` (secret serveur, jamais
   exposé au navigateur).
2. **Mot de passe admin** : Dashboard → **Settings → Environment Variables** → ajouter
   `ADMIN_PASSWORD` = le mot de passe choisi pour Manon.
3. **Redéployer** pour que les variables soient prises en compte.

### Utilisation

- Manon va sur `/admin`, saisit le mot de passe, modifie ses offres, clique **Enregistrer**.
- Les changements sont **visibles par tous les visiteurs en quelques secondes** (cache CDN court).
- `/admin` est en `noindex` (non référencé par les moteurs).

Sécurité : `BLOB_READ_WRITE_TOKEN` et `ADMIN_PASSWORD` restent côté serveur (env vars Vercel).
Le mot de passe est vérifié dans la fonction serverless (comparaison à temps constant).

## ⚠️ À personnaliser avant mise en ligne

1. **E-mail de contact** — `src/components/Contact.tsx`, constante `CONTACT_EMAIL`. Le formulaire
   ouvre pour l'instant le client mail (mailto). Brancher un vrai service (Formspree, FormSubmit…)
   ou une fonction quand l'hébergement est en place.
2. **Tarifs initiaux** — `src/offers.ts` (`DEFAULT_OFFERS`). Ensuite tout se gère depuis `/admin`.
3. **Police titres** — Intro Rust (charte) n'existe pas en webfont gratuit → remplacée par **Fredoka**.
   Fournir le `.woff2` + licence web pour un match exact.
4. **SEO** — `<title>`, `description`, Open Graph, JSON-LD `LocalBusiness` en place dans `index.html`.
   Ajouter l'URL réelle du domaine.

## Sections

Hero → À propos → Bande photo+texte → Mes balades → Galerie (carrousel) → Zone & tarifs → Contact → Footer.
Navigation ancrée (scroll fluide), responsive mobile/desktop.
