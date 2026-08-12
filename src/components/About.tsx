import TennisBall from './TennisBall'
import { useContent } from '../ContentContext'

export default function About() {
  const { about } = useContent()
  return (
    <section id="apropos" className="bg-cream-soft py-20 sm:py-28">
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

          <ul className="mt-8 flex flex-wrap gap-3">
            {about.tags.map((t) => (
              <li
                key={t}
                className="rounded-full bg-lime-400/20 px-4 py-2 text-sm font-700 text-forest-700 ring-1 ring-lime-400/40"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
