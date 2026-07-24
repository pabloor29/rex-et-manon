# Rex & Manon 🐾

One-page vitrine pour **Manon Berthier** — balades éducatives canines à Carcassonne.

Stack : **React 18 + TypeScript + Vite 6 + Tailwind CSS v4**.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build
```

## Structure

- `src/App.tsx` — assemble les sections
- `src/components/` — `Navbar`, `Hero`, `About`, `Services`, `Zones`, `Contact`, `Footer`
- `public/img/` — photos (Manon, T-Rex, bannière)
- `src/index.css` — thème Tailwind (palette verte + accents jaune/rouge, polices Fraunces + Nunito)

## ⚠️ À personnaliser avant mise en ligne

1. **E-mail de contact** — `src/components/Contact.tsx`, constante `CONTACT_EMAIL`. Le formulaire ouvre pour l'instant le client mail (mailto). Brancher un vrai service (Formspree, FormSubmit, ou back-end) quand l'hébergement est en place.
2. **Tarifs** — `src/components/Zones.tsx`, tableau `zones` (valeurs indicatives 15/20/25 €, à ajuster).
3. **SEO** — balises `<title>`, `description`, Open Graph et JSON-LD `LocalBusiness` déjà en place dans `index.html`. Ajouter l'URL réelle et un vrai favicon/logo dès réception de la DA.

## Sections

Bannière → À propos → Mes balades → Zone & tarifs → Contact → Footer.
Navigation ancrée (scroll fluide), responsive mobile/desktop.
