const zones = [
  {
    radius: '0 – 10 km',
    label: 'Autour de Carcassonne',
    price: '15',
    featured: false,
    perks: ['Prise en charge à domicile', 'Balade éducative', 'Petit compte-rendu'],
  },
  {
    radius: '10 – 20 km',
    label: 'Proche périphérie',
    price: '20',
    featured: true,
    perks: ['Prise en charge à domicile', 'Balade éducative', 'Petit compte-rendu'],
  },
  {
    radius: '20 – 30 km',
    label: 'Villages alentours',
    price: '25',
    featured: false,
    perks: ['Prise en charge à domicile', 'Balade éducative', 'Petit compte-rendu'],
  },
]

export default function Zones() {
  return (
    <section id="zones" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-forest-500 uppercase">
            Zone d'intervention & tarifs
          </span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-800 sm:text-4xl">
            J'interviens autour de Carcassonne
          </h2>
          <p className="mt-4 text-lg text-forest-900/70">
            Le tarif dépend de la distance depuis Carcassonne. J'organise mes tournées par secteur
            pour venir chercher votre chien directement chez vous.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {zones.map((z) => (
            <div
              key={z.radius}
              className={`relative flex flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1 ${
                z.featured
                  ? 'bg-forest-600 text-cream shadow-xl ring-4 ring-forest-200'
                  : 'bg-white text-forest-900 shadow-md ring-1 ring-forest-100'
              }`}
            >
              {z.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sun-400 px-4 py-1 text-xs font-800 text-forest-800">
                  Le plus demandé
                </span>
              )}
              <p className={`font-display text-2xl font-600 ${z.featured ? 'text-cream' : 'text-forest-700'}`}>
                {z.radius}
              </p>
              <p className={`text-sm ${z.featured ? 'text-cream/75' : 'text-forest-900/60'}`}>
                {z.label}
              </p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-sm">à partir de</span>
              </p>
              <p className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-600">{z.price}€</span>
                <span className={z.featured ? 'text-cream/70' : 'text-forest-900/50'}>/ balade</span>
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {z.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className={z.featured ? 'text-sun-400' : 'text-forest-500'}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 rounded-full px-6 py-3 text-center font-700 transition-colors ${
                  z.featured
                    ? 'bg-cream text-forest-700 hover:bg-white'
                    : 'bg-forest-600 text-cream hover:bg-forest-700'
                }`}
              >
                Demander ce secteur
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-forest-900/50">
          Tarifs indicatifs, en cours d'ajustement. Un doute sur votre secteur ? Écrivez-moi, je vous
          réponds avec le tarif exact. 🐾
        </p>
      </div>
    </section>
  )
}
