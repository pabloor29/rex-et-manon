// Contenu textuel éditable de tout le site — édité depuis /admin (onglet « Contenu »),
// stocké dans Supabase (schéma `rex_et_manon`, table `content`, ligne unique id = 1).
// Importé par le site (src) ET par les fonctions serverless (api/).
// NB : les tarifs/secteurs vivent dans `offers.ts` ; les photos et couleurs
// seront ajoutées aux étapes suivantes.

export type NavLink = { href: string; label: string }
export type Stat = { n: string; l: string }
export type Service = { icon: string; title: string; text: string }
export type Image = { src: string; alt: string }
export type Theme = { orange: string; cream: string; lime: string; forest: string }

export type SiteContent = {
  theme: Theme
  nav: { links: NavLink[]; cta: string }
  hero: {
    badge: string
    titleLead: string
    titleHighlight: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    stats: Stat[]
    photo: Image
    photoCaptionTitle: string
    photoCaptionSub: string
  }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    tags: string[]
    photo1: Image
    photo2: Image
  }
  feature: { badge: string; title: string; text: string; cta: string; photo: Image }
  services: { eyebrow: string; title: string; subtitle: string; items: Service[]; note: string }
  gallery: { eyebrow: string; title: string; subtitle: string; photos: Image[] }
  zones: { eyebrow: string; title: string; subtitle: string }
  contact: {
    bannerText: string
    eyebrow: string
    title: string
    text: string
    location: string
    email: string
    phone: string
    secteurs: string[]
    photo: Image
  }
  footer: { tagline: string; credit: string }
  legal: {
    statut: string
    siret: string
    adresse: string
    conservation: string
  }
  updatedAt?: string
}

export const DEFAULT_CONTENT: SiteContent = {
  theme: { orange: '#FD5900', cream: '#FEEAD4', lime: '#AACF31', forest: '#005A2F' },
  nav: {
    links: [
      { href: '#apropos', label: 'À propos' },
      { href: '#services', label: 'Mes balades' },
      { href: '#galerie', label: 'Galerie' },
      { href: '#zones', label: 'Zone & tarifs' },
      { href: '#contact', label: 'Contact' },
    ],
    cta: 'Me contacter',
  },
  hero: {
    badge: 'Carcassonne & alentours',
    titleLead: 'J’aide les chiens et leurs humains à construire un ',
    titleHighlight: 'meilleur quotidien',
    subtitle:
      'Rex & Manon, ce sont des balades éducatives canines : votre chien ne fait pas que se dépenser, il apprend, il comprend, il progresse… et il rentre à la maison plus serein.',
    ctaPrimary: 'Réserver une balade',
    ctaSecondary: 'Découvrir mes balades',
    stats: [
      { n: 'Éducatif', l: 'à chaque sortie' },
      { n: 'Indiv. & collectif', l: 'selon ton chien' },
      { n: 'Bienveillant', l: 'sans forcer' },
    ],
    photo: {
      src: '/img/photos/t-10.webp',
      alt: 'Manon en balade éducative avec deux chiens au soleil couchant, près de Carcassonne',
    },
    photoCaptionTitle: 'T-Rex & Tyla',
    photoCaptionSub: 'mes fidèles coéquipiers',
  },
  about: {
    eyebrow: 'Qui suis-je',
    title: 'Manon, passionnée par le bien-être des toutous',
    photo1: { src: '/img/photos/t-03.webp', alt: 'Manon accroupie entre ses deux chiens sur un chemin' },
    photo2: { src: '/img/photos/t-02.webp', alt: 'Portrait d’un des chiens de Manon, assis en forêt' },
    paragraphs: [
      'Diplômée en éducation et comportement canin, et en formation continue, je lance Rex & Manon : un service de balades éducatives canines à Carcassonne.',
      'Avant tout, je veux comprendre les chiens et leur permettre d’être de supers compagnons de vie — mais surtout d’avoir la meilleure vie de toutou possible. Parce que ce ne sont pas seulement nos compagnons : ce sont des êtres à part entière qui méritent de s’amuser sereinement.',
      'Derrière ce projet, il y a des mois de formation, de lectures et d’observations sur le comportement canin, les signaux de communication et les émotions du chien. L’objectif : offrir le meilleur à ceux que vous me confierez.',
    ],
    tags: ['Éducation canine', 'Comportement', 'Gestion des émotions', 'Bienveillance'],
  },
  feature: {
    badge: 'Apprendre en s’amusant',
    title: 'Des balades où votre chien apprend en s’amusant',
    text: 'Rappel, marche en laisse, gestion des émotions et des congénères : chaque sortie est une occasion de progresser, en pleine nature autour de Carcassonne.',
    cta: 'Voir mes balades',
    photo: { src: '/img/photos/t-06.webp', alt: 'Deux chiens assis côte à côte sur un chemin en forêt' },
  },
  services: {
    eyebrow: 'Mes balades',
    title: 'Des balades où votre chien apprend en s’amusant',
    subtitle:
      'L’idée est simple : proposer des balades où votre chien ne fait pas que se dépenser. Il apprend, il comprend, il progresse… et il rentre chez lui plus serein.',
    items: [
      {
        icon: '🐕',
        title: 'Balade individuelle',
        text: 'Une sortie rien que pour votre chien, à son rythme. Idéale pour travailler en douceur un trouble du comportement ou une difficulté précise.',
      },
      {
        icon: '🐾',
        title: 'Balade collective',
        text: 'En petit groupe, pour apprendre à bien vivre avec ses congénères : sociabilisation, gestion de l’excitation et des émotions.',
      },
      {
        icon: '🧠',
        title: 'Approche éducative',
        text: 'Chaque balade est l’occasion d’apprendre : rappel, marche en laisse, calme, gestion de la frustration… Votre chien progresse à chaque sortie.',
      },
      {
        icon: '💚',
        title: 'Accompagnement des humains',
        text: 'Je travaille les éventuels troubles ou difficultés rencontrés par les propriétaires, avec des conseils concrets pour le quotidien.',
      },
    ],
    note: '💡 Je travaille les difficultés de comportement sans surcoût lorsque j’ai les billes pour le faire. Le volet éducatif validé par un organisme de formation viendra enrichir mes services par la suite.',
  },
  gallery: {
    eyebrow: 'En balade',
    title: 'Quelques frimousses croisées sur les chemins',
    subtitle:
      'Des chiens qui apprennent, se dépensent et profitent de la nature autour de Carcassonne.',
    photos: [
      { src: '/img/photos/t-08.webp', alt: 'Portrait d’un chien tout sourire en balade' },
      { src: '/img/photos/t-11.webp', alt: 'Chien qui trotte vers l’objectif au soleil couchant' },
      { src: '/img/photos/t-12.webp', alt: 'Chien allongé, détendu, sur un chemin' },
      { src: '/img/photos/p-7431.webp', alt: 'Chien en balade sur une petite route de campagne' },
      { src: '/img/photos/t-09.webp', alt: 'Berger allemand heureux dans les herbes' },
      { src: '/img/photos/p-7071.webp', alt: 'Groupe de chiens en balade collective dans un pré' },
      { src: '/img/photos/t-02.webp', alt: 'Portrait d’un chien assis en forêt' },
      { src: '/img/photos/p-5523.webp', alt: 'Deux chiens qui courent dans la garrigue' },
      { src: '/img/photos/p-8748.webp', alt: 'Chien curieux, collier vert, dans la neige' },
    ],
  },
  zones: {
    eyebrow: 'Zone d’intervention & tarifs',
    title: 'J’interviens autour de Carcassonne',
    subtitle:
      'Le tarif dépend de la distance depuis Carcassonne. J’organise mes tournées par secteur pour venir chercher votre chien directement chez vous.',
  },
  contact: {
    bannerText: 'Offrez à votre chien des balades qui lui font du bien 🧡',
    eyebrow: 'Contact',
    title: 'Parlons de votre toutou',
    text: 'Une question, une demande de balade, un doute sur votre secteur ? Écrivez-moi via ce formulaire — tout est centralisé ici, je vous réponds au plus vite. 🐶',
    location: 'Carcassonne & alentours (Aude)',
    email: 'contact@rex-et-manon.fr',
    phone: '',
    secteurs: ['0 – 10 km de Carcassonne', '10 – 20 km', '20 – 30 km', 'Je ne sais pas'],
    photo: { src: '/img/photos/t-11.webp', alt: 'Chien qui trotte joyeusement au soleil couchant' },
  },
  footer: {
    tagline: 'Balades éducatives canines — Carcassonne & alentours',
    credit: 'Manon Berthier · Fait avec 🧡 à Carcassonne',
  },
  // Infos légales éditables depuis l'admin (onglet « Compte »), affichées sur
  // les pages /mentions-legales et /confidentialite. Vides par défaut → un
  // repère « à compléter » s'affiche tant qu'elles ne sont pas renseignées.
  legal: {
    statut: '',
    siret: '',
    adresse: '',
    conservation: '',
  },
}

/**
 * Fusionne récursivement une entrée inconnue (Supabase) avec les valeurs par défaut :
 * chaque champ manquant ou de mauvais type retombe sur le défaut. Les tableaux
 * fournis sont pris tels quels (l'admin les construit à partir des défauts).
 */
function fillDefaults<T>(def: T, input: unknown): T {
  if (Array.isArray(def)) {
    return (Array.isArray(input) ? input : def) as T
  }
  if (def && typeof def === 'object') {
    const out: Record<string, unknown> = {}
    const src = (input ?? {}) as Record<string, unknown>
    for (const k of Object.keys(def as Record<string, unknown>)) {
      out[k] = fillDefaults((def as Record<string, unknown>)[k], src[k])
    }
    return out as T
  }
  // primitive : garde l'entrée si même type que le défaut, sinon défaut.
  return input === undefined || input === null || typeof input !== typeof def ? def : (input as T)
}

export function normalizeContent(input: unknown): SiteContent {
  const o = (input ?? {}) as Partial<SiteContent>
  const merged = fillDefaults(DEFAULT_CONTENT, o)
  return {
    ...merged,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
  }
}
