const services = [
  {
    icon: '🐕',
    title: 'Balade individuelle',
    text: "Une sortie rien que pour votre chien, à son rythme. Idéale pour travailler en douceur un trouble du comportement ou une difficulté précise.",
  },
  {
    icon: '🐾',
    title: 'Balade collective',
    text: "En petit groupe, pour apprendre à bien vivre avec ses congénères : sociabilisation, gestion de l'excitation et des émotions.",
  },
  {
    icon: '🧠',
    title: 'Approche éducative',
    text: "Chaque balade est l'occasion d'apprendre : rappel, marche en laisse, calme, gestion de la frustration… Votre chien progresse à chaque sortie.",
  },
  {
    icon: '💚',
    title: 'Accompagnement des humains',
    text: "Je travaille les éventuels troubles ou difficultés rencontrés par les propriétaires, avec des conseils concrets pour le quotidien.",
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-forest-800 py-20 text-cream sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-sun-400 uppercase">Mes balades</span>
          <h2 className="mt-3 font-display text-3xl font-600 sm:text-4xl">
            Des balades où votre chien apprend en s'amusant
          </h2>
          <p className="mt-4 text-lg text-cream/80">
            L'idée est simple : proposer des balades où votre chien ne fait pas que se dépenser. Il
            apprend, il comprend, il progresse… et il rentre chez lui plus serein.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-3xl bg-forest-700/60 p-7 ring-1 ring-white/10 transition-colors hover:bg-forest-700"
            >
              <div className="grid size-14 place-items-center rounded-2xl bg-cream/10 text-3xl">
                {s.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-600">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-cream/75">{s.text}</p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-cream/5 px-6 py-4 text-center text-sm text-cream/70 ring-1 ring-white/10">
          💡 Je travaille les difficultés de comportement sans surcoût lorsque j'ai les billes pour le
          faire. Le volet éducatif validé par un organisme de formation viendra enrichir mes services
          par la suite.
        </p>
      </div>
    </section>
  )
}
