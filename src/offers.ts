// Modèle de données des offres (tarifs / zones) — édité depuis /admin,
// stocké dans Supabase (schéma `rex_et_manon`, table `offers`, ligne unique id = 1).
// Importé par le site (src) ET par les fonctions serverless (api/).

export type Zone = {
  radius: string
  label: string
  price: string
  featured: boolean
  perks: string[]
}

export type Offers = {
  zones: Zone[]
  note: string
  updatedAt?: string
}

export const DEFAULT_PERKS = ['Prise en charge à domicile', 'Balade éducative', 'Petit compte-rendu']

export const DEFAULT_OFFERS: Offers = {
  zones: [
    { radius: '0 – 10 km', label: 'Autour de Carcassonne', price: '15', featured: false, perks: [...DEFAULT_PERKS] },
    { radius: '10 – 20 km', label: 'Proche périphérie', price: '20', featured: true, perks: [...DEFAULT_PERKS] },
    { radius: '20 – 30 km', label: 'Villages alentours', price: '25', featured: false, perks: [...DEFAULT_PERKS] },
  ],
  note: 'Tarifs indicatifs, en cours d’ajustement. Un doute sur votre secteur ? Écrivez-moi, je vous réponds avec le tarif exact. 🐾',
}

// Garde-fou : normalise un objet inconnu (Supabase / API) vers un Offers valide.
export function normalizeOffers(input: unknown): Offers {
  const o = (input ?? {}) as Partial<Offers>
  const zones = Array.isArray(o.zones) && o.zones.length ? o.zones : DEFAULT_OFFERS.zones
  return {
    zones: zones.map((z) => ({
      radius: String(z?.radius ?? ''),
      label: String(z?.label ?? ''),
      price: String(z?.price ?? ''),
      featured: Boolean(z?.featured),
      perks: Array.isArray(z?.perks) ? z.perks.map(String).filter(Boolean) : [...DEFAULT_PERKS],
    })),
    note: typeof o.note === 'string' ? o.note : DEFAULT_OFFERS.note,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
  }
}
