import { useEffect, useRef, useState } from 'react'
import TennisBall from './TennisBall'
import { useContent } from '../ContentContext'

export default function About() {
  const { about } = useContent()
  // Bandeau défilant : une « moitié » = la liste unique des tags (aucun doublon visible à l'écran),
  // dupliquée → translateX(-50%) rejoue exactement la même moitié = boucle sans couture.
  const loop = [...about.tags]
  const marquee = [...loop, ...loop]

  const maskRef = useRef<HTMLDivElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)
  // Espace (px) appliqué en margin-right sur CHAQUE pastille (y compris la dernière) :
  //  - marge uniforme ⇒ translateX(-50%) tombe pile ⇒ boucle sans couture ;
  //  - calibré pour qu'une copie unique dépasse la largeur d'écran ⇒ le doublon reste
  //    hors champ ⇒ jamais deux fois le même mot en même temps.
  const [gap, setGap] = useState(14)
  useEffect(() => {
    const ul = ulRef.current
    const mask = maskRef.current
    if (!ul || !mask) return
    const measure = () => {
      const items = Array.from(ul.children) as HTMLElement[]
      const n = loop.length
      if (!items.length || n === 0) return
      let bubbles = 0 // largeur cumulée des pastilles d'une copie (hors marge)
      for (let i = 0; i < n && i < items.length; i++) bubbles += items[i].offsetWidth
      const buffer = 24 // garde le doublon hors écran
      const g = Math.max(8, Math.ceil((mask.clientWidth + buffer - bubbles) / n))
      setGap(g)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [about.tags])

  return (
    <section id="apropos" className="overflow-hidden bg-cream-soft py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        {/* Collage photos */}
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] shadow-lg ring-4 ring-cream-white">
            <img
              src={about.photo1.src}
              alt={about.photo1.alt}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -right-3 -bottom-8 w-40 overflow-hidden rounded-2xl shadow-xl ring-4 ring-cream-white sm:w-52">
            <img
              src={about.photo2.src}
              alt={about.photo2.alt}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          </div>
          <TennisBall className="absolute -top-5 -left-5 size-14 -rotate-12 drop-shadow-md" />
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-sm font-800 tracking-wide text-orange-500 uppercase">{about.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-700 sm:text-4xl">{about.title}</h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-forest-900/80">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau de pastilles pleine largeur (centré sur l'écran), défile en continu */}
      <div
        ref={maskRef}
        className="marquee-mask relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden py-3 sm:mt-16 lg:max-w-4xl"
      >
        <ul ref={ulRef} className="animate-marquee flex w-max">
          {marquee.map((t, i) => (
            <li
              key={i}
              aria-hidden={i >= loop.length}
              style={{ marginRight: gap }}
              className="shrink-0 whitespace-nowrap rounded-full bg-lime-400/20 px-4 py-2 text-sm font-700 text-forest-700 ring-1 ring-lime-400/40"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
