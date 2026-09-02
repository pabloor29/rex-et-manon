import { useEffect, useState } from 'react'
import { DEFAULT_OFFERS, normalizeOffers, type Offers } from '../offers'
import { useContent } from '../ContentContext'

export default function Zones() {
  const { zones: zonesText, contact } = useContent()
  const [offers, setOffers] = useState<Offers>(DEFAULT_OFFERS)

  // Charge les offres publiées (Supabase via /api/offres). Sans API → valeurs par défaut.
  useEffect(() => {
    let alive = true
    fetch('/api/offres')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => alive && setOffers(normalizeOffers(data)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <section id="zones" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-orange-500 uppercase">{zonesText.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-700 sm:text-4xl">{zonesText.title}</h2>
          <p className="mt-4 text-lg text-forest-900/70">{zonesText.subtitle}</p>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {offers.zones.map((z, i) => (
            <div
              key={z.radius}
              className={`relative flex w-full flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1 sm:w-[20rem] ${
                z.featured
                  ? 'bg-forest-600 text-cream-white shadow-xl ring-4 ring-lime-400/50'
                  : 'bg-cream-white text-forest-900 shadow-md ring-1 ring-forest-100'
              }`}
            >
              {z.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-800 text-white">
                  Le plus demandé
                </span>
              )}
              <p className={`font-display text-2xl font-600 ${z.featured ? 'text-cream-white' : 'text-forest-700'}`}>
                {z.radius}
              </p>
              <p className={`text-sm ${z.featured ? 'text-cream-white/75' : 'text-forest-900/60'}`}>
                {z.label}
              </p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-sm">à partir de</span>
              </p>
              <p className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-600">{z.price}€</span>
                <span className={z.featured ? 'text-cream-white/70' : 'text-forest-900/50'}>/ balade</span>
              </p>
              <p className={`mt-1 text-sm ${z.featured ? 'text-cream-white/70' : 'text-forest-900/60'}`}>
                Le tarif dépend de la zone géographique.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {z.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className={z.featured ? 'text-lime-400' : 'text-orange-500'}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('secteur:prefill', {
                      // Pré-remplit le <select> du formulaire avec le secteur correspondant.
                      detail: contact.secteurs[i] ?? z.label,
                    }),
                  )
                }
                className={`mt-8 rounded-full px-6 py-3 text-center font-700 transition-colors ${
                  z.featured
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-forest-600 text-cream-white hover:bg-forest-700'
                }`}
              >
                Demander ce secteur
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-forest-900/50">{offers.note}</p>
      </div>
    </section>
  )
}
