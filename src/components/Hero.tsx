export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* décor */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-forest-100 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-sun-400/30 blur-3xl"
      />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-700 text-forest-700">
            🌿 Carcassonne & alentours
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.1] font-600 text-forest-800 sm:text-5xl lg:text-6xl">
            J'aide les chiens et leurs humains à construire un{' '}
            <span className="text-forest-500">meilleur quotidien</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest-900/80">
            Rex&nbsp;&amp;&nbsp;Manon, ce sont des balades éducatives canines : votre chien ne fait
            pas que se dépenser, il apprend, il comprend, il progresse… et il rentre à la maison plus
            serein. 💚🐶
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-forest-600 px-7 py-3 font-700 text-cream shadow-md transition-transform hover:-translate-y-0.5 hover:bg-forest-700"
            >
              Réserver une balade
            </a>
            <a
              href="#services"
              className="rounded-full border-2 border-forest-200 px-7 py-3 font-700 text-forest-700 transition-colors hover:border-forest-400 hover:bg-forest-50"
            >
              Découvrir mes balades
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { n: 'Éducatif', l: 'à chaque sortie' },
              { n: 'Indiv. & collectif', l: 'selon ton chien' },
              { n: 'Bienveillant', l: 'sans forcer' },
            ].map((s) => (
              <div key={s.n}>
                <dt className="font-display text-lg font-600 text-forest-600">{s.n}</dt>
                <dd className="text-sm text-forest-900/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-xl ring-8 ring-white">
            <img
              src="/img/manon-balade.png"
              alt="Manon en balade éducative avec deux chiens à Carcassonne"
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-lg sm:block">
            <p className="font-display text-2xl font-600 text-forest-600">🐾 T-Rex</p>
            <p className="text-sm text-forest-900/60">mon fidèle coéquipier</p>
          </div>
        </div>
      </div>
    </section>
  )
}
