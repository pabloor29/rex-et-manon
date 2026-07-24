export default function Footer() {
  return (
    <footer className="bg-forest-900 py-12 text-cream/80">
      <div className="container-page flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="flex items-center justify-center gap-2 font-display text-xl font-600 text-cream sm:justify-start">
            <span aria-hidden>🐾</span> Rex <span className="text-brick-400">&</span> Manon
          </p>
          <p className="mt-1 text-sm text-cream/60">
            Balades éducatives canines — Carcassonne & alentours
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <a href="#apropos" className="hover:text-cream">À propos</a>
          <a href="#services" className="hover:text-cream">Mes balades</a>
          <a href="#zones" className="hover:text-cream">Zone & tarifs</a>
          <a href="#contact" className="hover:text-cream">Contact</a>
        </nav>
      </div>

      <div className="container-page mt-8 border-t border-white/10 pt-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Rex & Manon · Manon Berthier · Fait avec 💚 à Carcassonne
      </div>
    </footer>
  )
}
