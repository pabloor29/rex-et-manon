import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured, authedPost, uploadImage } from '../lib/supabaseClient'
import { DEFAULT_OFFERS, normalizeOffers, DEFAULT_PERKS, type Offers, type Zone } from '../offers'
import { DEFAULT_CONTENT, normalizeContent, type Image, type SiteContent } from '../content'
import { ContentValue } from '../ContentContext'
import { applyTheme } from '../theme'
import Hero from '../components/Hero'
import About from '../components/About'
import Feature from '../components/Feature'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Zones from '../components/Zones'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; at?: string }
  | { kind: 'error'; msg: string }

type Tab = 'contenu' | 'offres' | 'compte'
type SectionKey = Exclude<keyof SiteContent, 'updatedAt'>
type PatchFn = <K extends SectionKey>(key: K, val: Partial<SiteContent[K]>) => void

const TABS: { id: Tab; label: string }[] = [
  { id: 'contenu', label: 'Contenu du site' },
  { id: 'offres', label: 'Offres & tarifs' },
  { id: 'compte', label: 'Compte' },
]

// Sections affichables en aperçu (vrais composants du site).
const PREVIEW: Record<string, { label: string; Comp: ComponentType }> = {
  hero: { label: 'Accroche', Comp: Hero },
  about: { label: 'À propos', Comp: About },
  feature: { label: 'Bandeau', Comp: Feature },
  services: { label: 'Mes balades', Comp: Services },
  gallery: { label: 'Galerie', Comp: Gallery },
  zones: { label: 'Zone & tarifs', Comp: Zones },
  contact: { label: 'Contact', Comp: Contact },
  footer: { label: 'Pied de page', Comp: Footer },
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [tab, setTab] = useState<Tab>('contenu')

  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [contentStatus, setContentStatus] = useState<Status>({ kind: 'idle' })
  const [preview, setPreview] = useState<string | null>(null)

  // Empêche l'indexation de /admin par les moteurs.
  useEffect(() => {
    document.title = 'Admin — Rex & Manon'
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    return () => {
      document.head.removeChild(m)
    }
  }, [])

  // Suit la session Supabase (login / logout / refresh de token).
  useEffect(() => {
    if (!supabaseConfigured) {
      setSessionReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Charge le contenu publié.
  useEffect(() => {
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setContent(normalizeContent(d)))
      .catch(() => {})
  }, [])

  // Aperçu des couleurs en direct.
  useEffect(() => {
    applyTheme(content.theme)
  }, [content.theme])

  const patchContent: PatchFn = (key, val) => {
    setContent((prev) => ({ ...prev, [key]: { ...prev[key], ...val } }) as SiteContent)
  }

  async function saveContent() {
    setContentStatus({ kind: 'saving' })
    const cleaned: SiteContent = {
      ...content,
      about: {
        ...content.about,
        paragraphs: content.about.paragraphs.filter(Boolean),
        tags: content.about.tags.filter(Boolean),
      },
      contact: { ...content.contact, secteurs: content.contact.secteurs.filter(Boolean) },
    }
    try {
      const data = await authedPost<{ content: SiteContent }>('/api/save-content', { content: cleaned })
      setContent(normalizeContent(data.content))
      setContentStatus({ kind: 'saved', at: data.content?.updatedAt })
    } catch (e) {
      setContentStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Échec de l’enregistrement.' })
    }
  }

  if (!supabaseConfigured) {
    return (
      <Shell>
        <p className="mt-8 rounded-2xl bg-cream-white p-5 text-forest-900/80 ring-1 ring-forest-100">
          Configuration Supabase manquante (<code>VITE_SUPABASE_URL</code> /{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>).
        </p>
      </Shell>
    )
  }

  if (!sessionReady) {
    return (
      <Shell>
        <p className="mt-8 text-forest-900/70">Chargement…</p>
      </Shell>
    )
  }

  if (!session) {
    return (
      <Shell>
        <Login />
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-600 text-forest-700">Administration</h1>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="shrink-0 text-sm font-700 text-forest-600 hover:text-orange-500"
        >
          Déconnexion
        </button>
      </div>

      {/* Onglets — menu sticky pour naviguer sans remonter en haut */}
      <div className="sticky top-0 z-30 -mx-5 mt-6 bg-cream/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <nav className="flex flex-wrap gap-1 rounded-2xl bg-forest-100/60 p-1 text-sm font-700">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl px-3 py-2 text-center whitespace-nowrap transition sm:flex-none sm:px-4 ${
                tab === t.id ? 'bg-forest-700 text-cream-white shadow-sm' : 'text-forest-700 hover:bg-forest-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {tab === 'contenu' && (
          <ContentEditor c={content} patch={patchContent} status={contentStatus} onSave={saveContent} onPreview={setPreview} />
        )}
        {tab === 'offres' && <OffersEditor />}
        {tab === 'compte' && (
          <div className="space-y-5">
            <Coordonnees c={content} patch={patchContent} status={contentStatus} onSave={saveContent} onPreview={setPreview} />
            <ChangePassword />
          </div>
        )}
      </div>

      {preview && <SectionPreview section={preview} content={content} onClose={() => setPreview(null)} />}
    </Shell>
  )
}

/* ------------------------------------------------------------------ */
/* Aperçu d'une section (rend le vrai composant du site)               */
/* ------------------------------------------------------------------ */

function SectionPreview({ section, content, onClose }: { section: string; content: SiteContent; onClose: () => void }) {
  const entry = PREVIEW[section]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!entry) return null
  const { label, Comp } = entry
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-forest-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 bg-forest-800 px-4 py-3 text-cream-white">
        <span className="font-700">Aperçu — {label}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-orange-500 px-5 py-1.5 font-700 text-white hover:bg-orange-600"
        >
          Fermer
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-cream">
        <ContentValue value={content}>
          <Comp />
        </ContentValue>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Onglet « Contenu du site »                                          */
/* ------------------------------------------------------------------ */

function ContentEditor({
  c,
  patch,
  status,
  onSave,
  onPreview,
}: {
  c: SiteContent
  patch: PatchFn
  status: Status
  onSave: () => void
  onPreview: (s: string) => void
}) {
  return (
    <div className="space-y-5">
      <Card title="Couleurs de la charte" desc="Les nuances sont dérivées automatiquement. Aperçu en direct dans l'admin.">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField label="Orange (accents)" value={c.theme.orange} onChange={(v) => patch('theme', { orange: v })} />
          <ColorField label="Vert forêt (principal)" value={c.theme.forest} onChange={(v) => patch('theme', { forest: v })} />
          <ColorField label="Vert lime (pastilles)" value={c.theme.lime} onChange={(v) => patch('theme', { lime: v })} />
          <ColorField label="Crème (fond)" value={c.theme.cream} onChange={(v) => patch('theme', { cream: v })} />
        </div>
      </Card>

      <Card title="Accroche (Hero)" onPreview={() => onPreview('hero')}>
        <Field label="Badge" value={c.hero.badge} onChange={(v) => patch('hero', { badge: v })} />
        <Field label="Titre — début" value={c.hero.titleLead} onChange={(v) => patch('hero', { titleLead: v })} />
        <Field label="Titre — partie colorée" value={c.hero.titleHighlight} onChange={(v) => patch('hero', { titleHighlight: v })} />
        <Area label="Sous-titre" value={c.hero.subtitle} onChange={(v) => patch('hero', { subtitle: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bouton principal" value={c.hero.ctaPrimary} onChange={(v) => patch('hero', { ctaPrimary: v })} />
          <Field label="Bouton secondaire" value={c.hero.ctaSecondary} onChange={(v) => patch('hero', { ctaSecondary: v })} />
        </div>
        <Lines
          label="Chiffres-clés (un par ligne : Titre | légende)"
          value={c.hero.stats.map((s) => `${s.n} | ${s.l}`)}
          onChange={(rows) =>
            patch('hero', {
              stats: rows.map((r) => {
                const [n, l] = r.split('|')
                return { n: (n ?? '').trim(), l: (l ?? '').trim() }
              }),
            })
          }
        />
        <ImageField label="Photo principale" image={c.hero.photo} onChange={(img) => patch('hero', { photo: img })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Légende photo — titre" value={c.hero.photoCaptionTitle} onChange={(v) => patch('hero', { photoCaptionTitle: v })} />
          <Field label="Légende photo — sous-titre" value={c.hero.photoCaptionSub} onChange={(v) => patch('hero', { photoCaptionSub: v })} />
        </div>
      </Card>

      <Card title="À propos" onPreview={() => onPreview('about')}>
        <Field label="Sur-titre" value={c.about.eyebrow} onChange={(v) => patch('about', { eyebrow: v })} />
        <Field label="Titre" value={c.about.title} onChange={(v) => patch('about', { title: v })} />
        <Lines label="Paragraphes (un par ligne)" rows={6} value={c.about.paragraphs} onChange={(v) => patch('about', { paragraphs: v })} />
        <Lines label="Étiquettes (une par ligne)" value={c.about.tags} onChange={(v) => patch('about', { tags: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField label="Photo 1 (grande)" image={c.about.photo1} onChange={(img) => patch('about', { photo1: img })} />
          <ImageField label="Photo 2 (petite)" image={c.about.photo2} onChange={(img) => patch('about', { photo2: img })} />
        </div>
      </Card>

      <Card title="Bandeau (photo pleine largeur)" onPreview={() => onPreview('feature')}>
        <Field label="Badge" value={c.feature.badge} onChange={(v) => patch('feature', { badge: v })} />
        <Field label="Titre" value={c.feature.title} onChange={(v) => patch('feature', { title: v })} />
        <Area label="Texte" value={c.feature.text} onChange={(v) => patch('feature', { text: v })} />
        <Field label="Bouton" value={c.feature.cta} onChange={(v) => patch('feature', { cta: v })} />
        <ImageField label="Photo de fond" image={c.feature.photo} onChange={(img) => patch('feature', { photo: img })} />
      </Card>

      <Card title="Mes balades (services)" onPreview={() => onPreview('services')}>
        <Field label="Sur-titre" value={c.services.eyebrow} onChange={(v) => patch('services', { eyebrow: v })} />
        <Field label="Titre" value={c.services.title} onChange={(v) => patch('services', { title: v })} />
        <Area label="Sous-titre" value={c.services.subtitle} onChange={(v) => patch('services', { subtitle: v })} />

        <div className="space-y-4">
          {c.services.items.map((s, i) => (
            <div key={i} className="rounded-xl bg-cream p-4 ring-1 ring-forest-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-700 text-forest-700">Carte {i + 1}</span>
                <button
                  type="button"
                  onClick={() => patch('services', { items: c.services.items.filter((_, j) => j !== i) })}
                  className="text-sm font-700 text-orange-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[5rem_1fr]">
                <Field label="Icône" value={s.icon} onChange={(v) => patch('services', { items: c.services.items.map((x, j) => (j === i ? { ...x, icon: v } : x)) })} />
                <Field label="Titre" value={s.title} onChange={(v) => patch('services', { items: c.services.items.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              </div>
              <div className="mt-3">
                <Area label="Texte" value={s.text} onChange={(v) => patch('services', { items: c.services.items.map((x, j) => (j === i ? { ...x, text: v } : x)) })} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch('services', { items: [...c.services.items, { icon: '🐾', title: '', text: '' }] })}
            className="w-full rounded-xl border-2 border-dashed border-forest-200 py-2.5 font-700 text-forest-600 hover:border-orange-400 hover:text-orange-500"
          >
            + Ajouter une carte
          </button>
        </div>

        <Area label="Note sous les cartes" value={c.services.note} onChange={(v) => patch('services', { note: v })} />
      </Card>

      <Card title="Galerie" onPreview={() => onPreview('gallery')}>
        <Field label="Sur-titre" value={c.gallery.eyebrow} onChange={(v) => patch('gallery', { eyebrow: v })} />
        <Field label="Titre" value={c.gallery.title} onChange={(v) => patch('gallery', { title: v })} />
        <Area label="Sous-titre" value={c.gallery.subtitle} onChange={(v) => patch('gallery', { subtitle: v })} />

        <div className="space-y-3">
          <label className="block text-sm font-700 text-forest-800">Photos du carrousel</label>
          {c.gallery.photos.map((p, i) => (
            <div key={i} className="rounded-xl bg-cream p-4 ring-1 ring-forest-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-700 text-forest-700">Photo {i + 1}</span>
                <button
                  type="button"
                  onClick={() => patch('gallery', { photos: c.gallery.photos.filter((_, j) => j !== i) })}
                  className="text-sm font-700 text-orange-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
              <div className="mt-3">
                <ImageField label="" image={p} onChange={(img) => patch('gallery', { photos: c.gallery.photos.map((x, j) => (j === i ? img : x)) })} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch('gallery', { photos: [...c.gallery.photos, { src: '', alt: '' }] })}
            className="w-full rounded-xl border-2 border-dashed border-forest-200 py-2.5 font-700 text-forest-600 hover:border-orange-400 hover:text-orange-500"
          >
            + Ajouter une photo
          </button>
        </div>
      </Card>

      <Card title="Zone & tarifs (en-tête)" desc="Les secteurs et prix se modifient dans l'onglet « Offres & tarifs »." onPreview={() => onPreview('zones')}>
        <Field label="Sur-titre" value={c.zones.eyebrow} onChange={(v) => patch('zones', { eyebrow: v })} />
        <Field label="Titre" value={c.zones.title} onChange={(v) => patch('zones', { title: v })} />
        <Area label="Sous-titre" value={c.zones.subtitle} onChange={(v) => patch('zones', { subtitle: v })} />
      </Card>

      <Card title="Contact" desc="L'email et le téléphone se modifient dans l'onglet « Compte »." onPreview={() => onPreview('contact')}>
        <Area label="Bandeau (au-dessus du formulaire)" value={c.contact.bannerText} onChange={(v) => patch('contact', { bannerText: v })} />
        <Field label="Sur-titre" value={c.contact.eyebrow} onChange={(v) => patch('contact', { eyebrow: v })} />
        <Field label="Titre" value={c.contact.title} onChange={(v) => patch('contact', { title: v })} />
        <Area label="Texte" value={c.contact.text} onChange={(v) => patch('contact', { text: v })} />
        <Field label="Localisation" value={c.contact.location} onChange={(v) => patch('contact', { location: v })} />
        <Lines label="Secteurs du formulaire (un par ligne)" value={c.contact.secteurs} onChange={(v) => patch('contact', { secteurs: v })} />
        <ImageField label="Photo bandeau" image={c.contact.photo} onChange={(img) => patch('contact', { photo: img })} />
      </Card>

      <Card title="Pied de page" onPreview={() => onPreview('footer')}>
        <Field label="Accroche" value={c.footer.tagline} onChange={(v) => patch('footer', { tagline: v })} />
        <Field label="Crédit (après l'année)" value={c.footer.credit} onChange={(v) => patch('footer', { credit: v })} />
      </Card>

      <SaveBar status={status} onSave={onSave} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Onglet « Compte » — coordonnées                                     */
/* ------------------------------------------------------------------ */

function Coordonnees({
  c,
  patch,
  status,
  onSave,
  onPreview,
}: {
  c: SiteContent
  patch: PatchFn
  status: Status
  onSave: () => void
  onPreview: (s: string) => void
}) {
  return (
    <>
      <Card title="Coordonnées" desc="Affichées dans la section Contact du site." onPreview={() => onPreview('contact')}>
        <Field label="Email de réception" value={c.contact.email} onChange={(v) => patch('contact', { email: v })} />
        <Field label="Téléphone (laisser vide pour ne pas l'afficher)" value={c.contact.phone} onChange={(v) => patch('contact', { phone: v })} />
      </Card>
      <SaveBar status={status} onSave={onSave} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Onglet « Offres & tarifs »                                          */
/* ------------------------------------------------------------------ */

function OffersEditor() {
  const [offers, setOffers] = useState<Offers>(DEFAULT_OFFERS)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    fetch('/api/offres')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setOffers(normalizeOffers(d)))
      .catch(() => {})
  }, [])

  function patchZone(i: number, patch: Partial<Zone>) {
    setOffers((o) => ({ ...o, zones: o.zones.map((z, j) => (j === i ? { ...z, ...patch } : z)) }))
  }
  function setFeatured(i: number) {
    setOffers((o) => ({ ...o, zones: o.zones.map((z, j) => ({ ...z, featured: j === i })) }))
  }
  function addZone() {
    setOffers((o) => ({
      ...o,
      zones: [...o.zones, { radius: '', label: '', price: '', featured: false, perks: [...DEFAULT_PERKS] }],
    }))
  }
  function removeZone(i: number) {
    setOffers((o) => ({ ...o, zones: o.zones.filter((_, j) => j !== i) }))
  }

  async function save() {
    setStatus({ kind: 'saving' })
    try {
      const data = await authedPost<{ offers: Offers }>('/api/save-offres', { offers })
      setOffers(normalizeOffers(data.offers))
      setStatus({ kind: 'saved', at: data.offers?.updatedAt })
    } catch (e) {
      setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Échec de l’enregistrement.' })
    }
  }

  return (
    <div className="space-y-5">
      {offers.zones.map((z, i) => (
        <div key={i} className="rounded-2xl bg-cream-white p-5 shadow-sm ring-1 ring-forest-100">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-600 text-forest-700">Secteur {i + 1}</h2>
            <button type="button" onClick={() => removeZone(i)} className="text-sm font-700 text-orange-500 hover:underline">
              Supprimer
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Distance (ex : 0 – 10 km)" value={z.radius} onChange={(v) => patchZone(i, { radius: v })} />
            <Field label="Libellé" value={z.label} onChange={(v) => patchZone(i, { label: v })} />
            <Field label="Prix (€)" value={z.price} onChange={(v) => patchZone(i, { price: v })} />
          </div>

          <div className="mt-4">
            <Lines label="Ce qui est inclus (une ligne = un point)" value={z.perks} onChange={(v) => patchZone(i, { perks: v })} />
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm font-700 text-forest-800">
            <input type="radio" name="featured" checked={z.featured} onChange={() => setFeatured(i)} className="size-4 accent-orange-500" />
            Mettre en avant (« Le plus demandé »)
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addZone}
        className="w-full rounded-2xl border-2 border-dashed border-forest-200 py-3 font-700 text-forest-600 hover:border-orange-400 hover:text-orange-500"
      >
        + Ajouter un secteur
      </button>

      <Card title="Petite note sous les tarifs">
        <Area label="" value={offers.note} onChange={(v) => setOffers((o) => ({ ...o, note: v }))} />
      </Card>

      <SaveBar status={status} onSave={save} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Éléments partagés                                                   */
/* ------------------------------------------------------------------ */

/** Cadre commun : fond + logo + lien retour. */
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-page max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <img src="/brand/logo-horizontal-couleur.svg" alt="Rex & Manon" className="h-9 w-auto" />
          <a href="/" className="text-sm font-700 text-forest-700 hover:text-orange-500">
            ← Voir le site
          </a>
        </header>
        {children}
      </div>
    </div>
  )
}

function SaveBar({ status, onSave }: { status: Status; onSave: () => void }) {
  return (
    <div className="sticky bottom-4 flex flex-wrap items-center gap-4 rounded-2xl bg-forest-700 p-4 text-cream-white shadow-lg">
      <button
        type="button"
        onClick={onSave}
        disabled={status.kind === 'saving'}
        className="rounded-full bg-orange-500 px-7 py-3 font-700 text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
      >
        {status.kind === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
      </button>
      {status.kind === 'saved' && (
        <span className="text-sm text-lime-300">
          ✓ Enregistré{status.at ? ` — ${new Date(status.at).toLocaleString('fr-FR')}` : ''}
        </span>
      )}
      {status.kind === 'error' && <span className="text-sm text-orange-200">⚠ {status.msg}</span>}
    </div>
  )
}

/** Formulaire de connexion admin (Supabase Auth email + mot de passe). */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-12 max-w-sm rounded-2xl bg-cream-white p-6 shadow-sm ring-1 ring-forest-100">
      <h1 className="font-display text-2xl font-600 text-forest-700">Connexion admin</h1>
      <p className="mt-1 text-sm text-forest-900/70">Accès réservé à l’édition du site.</p>

      <label className="mt-5 block text-sm font-700 text-forest-800" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream px-4 py-2.5 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      <label className="mt-4 block text-sm font-700 text-forest-800" htmlFor="pw">
        Mot de passe
      </label>
      <input
        id="pw"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream px-4 py-2.5 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      {error && <p className="mt-3 text-sm text-orange-600">⚠ {error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full bg-orange-500 px-7 py-3 font-700 text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}

/** Changer le mot de passe du compte admin connecté (Supabase Auth). */
function ChangePassword() {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (pw.length < 8) {
      setStatus({ kind: 'error', msg: 'Mot de passe trop court (8 caractères min).' })
      return
    }
    if (pw !== pw2) {
      setStatus({ kind: 'error', msg: 'Les deux mots de passe ne correspondent pas.' })
      return
    }
    setStatus({ kind: 'saving' })
    const { error } = await supabase.auth.updateUser({ password: pw })
    if (error) {
      setStatus({ kind: 'error', msg: error.message })
      return
    }
    setPw('')
    setPw2('')
    setStatus({ kind: 'saved' })
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-cream-white p-5 shadow-sm ring-1 ring-forest-100">
      <h2 className="font-display text-lg font-600 text-forest-700">Mot de passe</h2>
      <p className="mt-1 text-sm text-forest-900/70">Change le mot de passe de ton compte admin.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-700 text-forest-800" htmlFor="np">
            Nouveau mot de passe
          </label>
          <input
            id="np"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream px-4 py-2.5 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div>
          <label className="block text-sm font-700 text-forest-800" htmlFor="np2">
            Confirmer
          </label>
          <input
            id="np2"
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream px-4 py-2.5 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status.kind === 'saving'}
          className="rounded-full bg-forest-700 px-6 py-2.5 font-700 text-cream-white transition hover:bg-forest-800 disabled:opacity-60"
        >
          {status.kind === 'saving' ? 'Modification…' : 'Changer le mot de passe'}
        </button>
        {status.kind === 'saved' && <span className="text-sm text-forest-600">✓ Mot de passe modifié</span>}
        {status.kind === 'error' && <span className="text-sm text-orange-600">⚠ {status.msg}</span>}
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Champs réutilisables                                                */
/* ------------------------------------------------------------------ */

function Card({ title, desc, onPreview, children }: { title: string; desc?: string; onPreview?: () => void; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-cream-white p-5 shadow-sm ring-1 ring-forest-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-600 text-forest-700">{title}</h2>
          {desc && <p className="mt-1 text-sm text-forest-900/60">{desc}</p>}
        </div>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="shrink-0 rounded-full bg-forest-100 px-3 py-1.5 text-xs font-700 text-forest-700 transition hover:bg-forest-200"
          >
            👁 Aperçu
          </button>
        )}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

const inputCls =
  'mt-1.5 w-full rounded-xl border border-forest-100 bg-cream px-4 py-2.5 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200'

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      {label && <label className="block text-sm font-700 text-forest-800">{label}</label>}
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  )
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      {label && <label className="block text-sm font-700 text-forest-800">{label}</label>}
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  )
}

/** Édite un tableau de chaînes via un textarea (une ligne = un élément). */
function Lines({ label, value, onChange, rows = 3 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <div>
      {label && <label className="block text-sm font-700 text-forest-800">{label}</label>}
      <textarea rows={rows} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} className={inputCls} />
    </div>
  )
}

/** Aperçu + upload d'une image vers Supabase Storage + texte alternatif. */
function ImageField({ label, image, onChange }: { label: string; image: Image; onChange: (img: Image) => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const url = await uploadImage(file)
      onChange({ ...image, src: url })
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Upload échoué')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-700 text-forest-800">{label}</label>}
      <div className="mt-1.5 flex items-center gap-3">
        {image.src ? (
          <img src={image.src} alt="" className="size-16 shrink-0 rounded-lg object-cover ring-1 ring-forest-100" />
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-cream text-forest-300 ring-1 ring-forest-100">🐾</div>
        )}
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={busy}
            className="block w-full text-sm text-forest-900 file:mr-3 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:font-700 file:text-cream-white hover:file:bg-forest-800 disabled:opacity-60"
          />
          {busy && <span className="text-sm text-forest-600">Upload…</span>}
          {err && <span className="text-sm text-orange-600">⚠ {err}</span>}
        </div>
      </div>
      <input
        value={image.alt}
        onChange={(e) => onChange({ ...image, alt: e.target.value })}
        placeholder="Texte alternatif (accessibilité / SEO)"
        className={`${inputCls} mt-2`}
      />
    </div>
  )
}

/** Sélecteur de couleur (pastille + champ hex). */
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-700 text-forest-800">{label}</label>
      <div className="mt-1.5 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-forest-100 bg-cream p-1"
        />
        <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} max-w-[9rem] uppercase`} />
      </div>
    </div>
  )
}
