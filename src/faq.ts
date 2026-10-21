// Modèle de données de la FAQ — éditée depuis /admin (onglet « FAQ »),
// stockée dans Supabase (schéma `rex_et_manon`, table `faq`, ligne unique id = 1,
// colonne `items jsonb`). Importé par le site (src) ET par les fonctions
// serverless (api/). Chaque entrée = une question + une réponse.
//
// Le contenu est rendu côté serveur (SSR) + balisé en JSON-LD FAQPage pour le
// référencement (voir api/ssr.ts).

export type FaqItem = { question: string; answer: string }

export type Faq = {
  items: FaqItem[]
  updatedAt?: string
}

// Exemples de démarrage (affichés tant que la propriétaire ne les a pas modifiés).
// Expliquent la différence garde classique / pet sitter vs balade éducative, et
// ce qu'est simplement une balade éducative.
export const DEFAULT_FAQ: Faq = {
  items: [
    {
      question: 'Qu’est-ce qu’une balade éducative ?',
      answer:
        'Une balade éducative, c’est bien plus qu’une simple sortie pour se dépenser. Pendant la promenade, votre chien apprend en situation réelle : rappel, marche en laisse, gestion de l’excitation, rencontres avec ses congénères, retour au calme… Chaque sortie devient une occasion de progresser, en pleine nature et en douceur, sans contrainte ni dressage forcé. Votre chien se dépense physiquement ET mentalement, et rentre à la maison plus serein.',
    },
    {
      question: 'Quelle différence avec une garde de chien classique ou un pet sitter ?',
      answer:
        'Une garde classique ou un pet sitter répondent surtout à un besoin pratique : sortir, nourrir ou surveiller votre chien quand vous êtes absent. L’objectif est son bien-être et sa dépense, mais pas forcément son apprentissage. La balade éducative va plus loin : c’est une promenade pensée comme un vrai moment d’éducation positive. Formée en éducation et comportement canin, je profite de chaque sortie pour travailler concrètement avec votre chien (rappel, marche en laisse, sociabilisation, gestion des émotions) et vous donner des conseils pour le quotidien. En résumé : le pet sitting s’occupe de votre chien, la balade éducative l’aide aussi à progresser.',
    },
    {
      question: 'La balade éducative, est-ce la même chose que du dressage ?',
      answer:
        'Non. Le dressage évoque souvent la contrainte et l’obéissance stricte. J’utilise une approche éducative et positive : on travaille en respectant le rythme du chien, ses émotions et sa personnalité, sans jamais le forcer. L’idée est de l’aider à comprendre et à prendre de bonnes habitudes, en douceur, pour qu’il devienne un compagnon de vie épanoui.',
    },
    {
      question: 'Mon chien n’est pas très sociable ou a des difficultés de comportement : peut-il participer ?',
      answer:
        'Oui, c’est justement tout l’intérêt des balades individuelles : une sortie rien que pour lui, à son rythme, pour travailler en douceur une difficulté précise (réactivité, peur, excitation, tirage en laisse…). Selon le profil de votre chien, on choisit ensemble la formule la plus adaptée, individuelle ou en petit groupe.',
    },
    {
      question: 'Où se déroulent les balades et comment ça se passe ?',
      answer:
        'Les balades ont lieu en pleine nature, autour de Carcassonne et dans les alentours (Aude). Je viens chercher votre chien directement chez vous et je le ramène après la sortie. Le tarif dépend de votre secteur géographique — n’hésitez pas à me contacter pour connaître le tarif exact et organiser une première balade.',
    },
  ],
}

// Garde-fou : normalise un objet inconnu (Supabase / API) vers un Faq valide.
// Un tableau d'items fourni (même vide) est pris tel quel ; absent → défauts.
export function normalizeFaq(input: unknown): Faq {
  const o = (input ?? {}) as Partial<Faq>
  const items = Array.isArray(o.items)
    ? o.items.map((it) => ({
        question: String((it as FaqItem)?.question ?? ''),
        answer: String((it as FaqItem)?.answer ?? ''),
      }))
    : DEFAULT_FAQ.items
  return {
    items,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
  }
}
