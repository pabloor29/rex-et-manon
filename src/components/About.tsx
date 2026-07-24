export default function About() {
  return (
    <section id="apropos" className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
          <img
            src="/img/manon-rex.jpeg"
            alt="Manon Berthier et son chien T-Rex"
            className="mt-8 aspect-[3/4] w-full rounded-3xl object-cover shadow-md"
            loading="lazy"
          />
          <img
            src="/img/manon-pitch.jpeg"
            alt="Manon présentant le projet Rex & Manon"
            className="aspect-[3/4] w-full rounded-3xl object-cover shadow-md"
            loading="lazy"
          />
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-sm font-800 tracking-wide text-forest-500 uppercase">Qui suis-je</span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-800 sm:text-4xl">
            Manon, passionnée par le bien-être des toutous
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-forest-900/80">
            <p>
              Diplômée en éducation et comportement canin, et en formation continue, je lance{' '}
              <strong className="text-forest-700">Rex&nbsp;&amp;&nbsp;Manon</strong> : un service de
              balades éducatives canines à Carcassonne.
            </p>
            <p>
              Avant tout, je veux comprendre les chiens et leur permettre d'être de supers compagnons
              de vie — mais surtout d'avoir la meilleure vie de toutou possible. Parce que ce ne sont
              pas seulement nos compagnons : ce sont des êtres à part entière qui méritent de s'amuser
              sereinement.
            </p>
            <p>
              Derrière ce projet, il y a des mois de formation, de lectures et d'observations sur le
              comportement canin, les signaux de communication et les émotions du chien. L'objectif :
              offrir le meilleur à ceux que vous me confierez. 🌿
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {['Éducation canine', 'Comportement', 'Gestion des émotions', 'Bienveillance'].map((t) => (
              <li
                key={t}
                className="rounded-full bg-forest-50 px-4 py-2 text-sm font-700 text-forest-700 ring-1 ring-forest-100"
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
