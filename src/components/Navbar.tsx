import { useEffect, useState } from 'react'

const links = [
  { href: '#apropos', label: 'À propos' },
  { href: '#services', label: 'Mes balades' },
  { href: '#zones', label: 'Zone & tarifs' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
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
      <nav className="container-page flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-600 text-forest-700">
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-forest-600 text-cream">
            🐾
          </span>
          Rex&nbsp;<span className="text-brick-500">&</span>&nbsp;Manon
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-600 text-forest-800 transition-colors hover:text-forest-500"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full bg-forest-600 px-5 py-2 text-sm font-700 text-cream shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-forest-700"
            >
              Me contacter
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
                  className="block rounded-lg px-2 py-3 font-600 text-forest-800 hover:bg-forest-50"
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
