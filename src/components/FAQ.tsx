import { useFaq } from '../FaqContext'

/**
 * Section FAQ (bas de page). Accordéon natif <details>/<summary> : le contenu
 * est présent dans le HTML (rendu serveur) donc indexable, et fonctionne sans
 * JavaScript. Le balisage JSON-LD FAQPage est injecté par le SSR (api/ssr.ts).
 */
export default function FAQ() {
  const { items } = useFaq()
  if (!items.length) return null

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-800 tracking-wide text-orange-500 uppercase">Questions fréquentes</span>
          <h2 className="mt-3 font-display text-3xl font-600 text-forest-700 sm:text-4xl">
            Vous vous posez des questions&nbsp;?
          </h2>
          <p className="mt-4 text-lg text-forest-900/70">
            Tout ce qu’il faut savoir sur mes balades éducatives autour de Carcassonne.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {items.map((it, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-cream-white px-6 py-5 shadow-sm ring-1 ring-forest-100 transition-colors hover:ring-forest-200 open:ring-orange-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-600 text-forest-700 [&::-webkit-details-marker]:hidden">
                <span>{it.question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700 transition-transform duration-200 group-open:rotate-45 group-open:bg-orange-500 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-forest-900/75">{it.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
