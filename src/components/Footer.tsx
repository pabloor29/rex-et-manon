import { useContent } from '../ContentContext'

export default function Footer() {
  const { nav, footer } = useContent()
  return (
    <footer className="bg-forest-800 py-12 text-cream-white/80">
      <div className="container-page flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <img
            src="/brand/logo-horizontal-blanc.svg"
            alt="Rex & Manon"
            className="mx-auto h-9 w-auto sm:mx-0"
          />
          <p className="mt-3 text-sm text-cream-white/60">{footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-cream-white">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="container-page mt-8 border-t border-cream-white/10 pt-6 text-center text-xs text-cream-white/50">
        © {new Date().getFullYear()} Rex & Manon · {footer.credit}
      </div>
    </footer>
  )
}
