import TennisBall from './TennisBall'
import { useContent } from '../ContentContext'

/** Bande pleine largeur : photo + texte positionné par-dessus. */
export default function Feature() {
  const { feature } = useContent()
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={feature.photo.src}
        alt={feature.photo.alt}
        className="h-[62vh] max-h-[560px] min-h-80 w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/85 via-forest-900/55 to-forest-900/10" />

      <div className="absolute inset-0 flex items-center">
        <div className="container-page">
          <div className="max-w-xl text-cream-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/90 px-4 py-1.5 text-sm font-700 text-white">
              <TennisBall variant="blanc" className="size-4" /> {feature.badge}
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight font-600 sm:text-4xl lg:text-5xl">
              {feature.title}
            </h2>
            <p className="mt-4 text-lg text-cream-white/85">{feature.text}</p>
            <a
              href="#services"
              className="mt-7 inline-block rounded-full bg-orange-500 px-7 py-3 font-700 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
            >
              {feature.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
