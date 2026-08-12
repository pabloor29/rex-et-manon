import TennisBall from './TennisBall'
import { useContent } from '../ContentContext'

export default function Hero() {
  const { hero } = useContent()
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* décor — halos de couleurs de la charte */}
      <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-lime-300/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-orange-300/30 blur-3xl" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-400/25 px-4 py-1.5 text-sm font-700 text-forest-700 ring-1 ring-lime-400/40">
            <TennisBall className="size-4" /> {hero.badge}
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-600 text-forest-700 sm:text-5xl lg:text-6xl">
            {hero.titleLead}
            <span className="text-orange-500">{hero.titleHighlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest-900/80">{hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-orange-500 px-7 py-3 font-700 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#services"
              className="rounded-full border-2 border-forest-600 px-7 py-3 font-700 text-forest-700 transition-colors hover:bg-forest-600 hover:text-white"
            >
              {hero.ctaSecondary}
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {hero.stats.map((s) => (
              <div key={s.n}>
                <dt className="font-display text-lg font-600 text-forest-600">{s.n}</dt>
                <dd className="text-sm text-forest-900/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <TennisBall className="absolute -top-6 -left-6 z-10 size-16 rotate-12 drop-shadow-md sm:size-20" />
          <div className="overflow-hidden rounded-[2.5rem] shadow-xl ring-8 ring-cream-white">
            <img
              src={hero.photo.src}
              alt={hero.photo.alt}
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-cream-white p-4 shadow-lg ring-1 ring-orange-100 sm:block">
            <p className="font-display text-2xl font-600 text-orange-500">{hero.photoCaptionTitle}</p>
            <p className="text-sm text-forest-900/60">{hero.photoCaptionSub}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
