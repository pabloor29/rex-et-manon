import { useEffect, useRef, useState } from 'react'
import { useContent } from '../ContentContext'

export default function Gallery() {
  const { gallery } = useContent()
  const photos = gallery.photos
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Met à jour la puce active selon le défilement
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / (el.scrollWidth / photos.length))
      setActive(Math.max(0, Math.min(photos.length - 1, i)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [photos.length])

  function scrollTo(i: number) {
    const el = trackRef.current
    if (!el) return
    const clamped = (i + photos.length) % photos.length
    el.scrollTo({ left: (el.scrollWidth / photos.length) * clamped, behavior: 'smooth' })
  }

  return (
    <section id="galerie" className="bg-cream-soft py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-orange-500 uppercase">{gallery.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-700 sm:text-4xl">{gallery.title}</h2>
          <p className="mt-4 text-lg text-forest-900/70">{gallery.subtitle}</p>
        </div>

        <div className="relative mt-12">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {photos.map((p) => (
              <figure
                key={p.src}
                className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-md ring-1 ring-forest-100 sm:w-[46%] lg:w-[32%]"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
            ))}
          </div>

          {/* Contrôles */}
          <button
            type="button"
            onClick={() => scrollTo(active - 1)}
            aria-label="Photo précédente"
            className="absolute top-1/2 -left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-forest-700 shadow-lg ring-1 ring-forest-100 transition hover:bg-orange-500 hover:text-white sm:-left-4"
          >
            <span className="text-xl">‹</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo(active + 1)}
            aria-label="Photo suivante"
            className="absolute top-1/2 -right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-forest-700 shadow-lg ring-1 ring-forest-100 transition hover:bg-orange-500 hover:text-white sm:-right-4"
          >
            <span className="text-xl">›</span>
          </button>
        </div>

        {/* Puces */}
        <div className="mt-6 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? 'w-6 bg-orange-500' : 'w-2.5 bg-forest-200 hover:bg-forest-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
