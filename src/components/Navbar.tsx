import { useEffect, useState } from 'react'
import { useContent } from '../ContentContext'

export default function Navbar() {
  const { nav } = useContent()
  const links = nav.links
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/90 shadow-sm backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex items-center justify-between py-3">
        <a href="#top" className="flex items-center" aria-label="Rex & Manon — accueil">
          <img
            src="/brand/logo-horizontal-couleur.svg"
            alt="Rex & Manon"
            className="h-9 w-auto sm:h-10"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-700 text-forest-800 transition-colors hover:text-orange-500"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-700 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
            >
              {nav.cta}
            </a>
          </li>
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg text-forest-800 md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-100 bg-cream md:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 font-700 text-forest-800 hover:bg-forest-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
