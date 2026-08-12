import Scallop from './Scallop'
import { useContent } from '../ContentContext'

export default function Services() {
  const { services } = useContent()
  return (
    <section id="services" className="relative bg-forest-700 text-cream-white">
      {/* Feston / store — élément graphique de la charte */}
      <Scallop color="bg-cream-soft" />

      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-lime-400 uppercase">{services.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-600 sm:text-4xl">{services.title}</h2>
          <p className="mt-4 text-lg text-cream-white/80">{services.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.items.map((s) => (
            <article
              key={s.title}
              className="rounded-3xl bg-forest-600/50 p-7 ring-1 ring-cream-white/10 transition-colors hover:bg-forest-600"
            >
              <div className="grid size-14 place-items-center rounded-2xl bg-lime-400/20 text-3xl ring-1 ring-lime-400/30">
                {s.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-600">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-cream-white/75">{s.text}</p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-cream-white/5 px-6 py-4 text-center text-sm text-cream-white/70 ring-1 ring-cream-white/10">
          {services.note}
        </p>
      </div>
    </section>
  )
}
