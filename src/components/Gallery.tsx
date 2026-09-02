import { useEffect, useRef, useState } from 'react'
import { useContent } from '../ContentContext'

export default function Gallery() {
  const { gallery } = useContent()
  const photos = gallery.photos
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [perView, setPerView] = useState(1)

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

  // Nombre de photos visibles par écran → taille de la barre orange
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const first = el.firstElementChild as HTMLElement | null
      if (!first) return
      const gap = 16 // gap-4
      const slot = first.offsetWidth + gap
      setPerView(Math.max(1, Math.min(photos.length, Math.round(el.clientWidth / slot))))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
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
                className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-md ring-1 ring-forest-100 sm:w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-10.667px)]"
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

        {/* Puces : barre orange englobant les photos visibles à l'écran */}
        {(() => {
          const slot = 18 // puce 10px (w-2.5) + gap 8px (gap-2)
          const start = Math.min(active, Math.max(0, photos.length - perView))
          return (
            <div className="mt-6 flex justify-center">
              <div className="relative inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-orange-500 transition-all"
                  style={{ left: start * slot - 4, width: (perView - 1) * slot + 18 }}
                />
                {photos.map((p, i) => {
                  const inView = i >= start && i < start + perView
                  return (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => scrollTo(i)}
                      aria-label={`Aller à la photo ${i + 1}`}
                      className={`relative z-10 size-2.5 rounded-full transition-all ${
                        inView ? 'bg-white' : 'bg-forest-200 hover:bg-forest-300'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>
    </section>
  )
}
