import { useState, type FormEvent } from 'react'

// 👉 Remplace par l'adresse e-mail de réception (ou branche un service de formulaire).
const CONTACT_EMAIL = 'contact@rex-et-manon.fr'

const secteurs = ['0 – 10 km de Carcassonne', '10 – 20 km', '20 – 30 km', 'Je ne sais pas']

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const nom = String(data.get('nom') ?? '')
    const chien = String(data.get('chien') ?? '')
    const secteur = String(data.get('secteur') ?? '')
    const tel = String(data.get('tel') ?? '')
    const message = String(data.get('message') ?? '')

    const body = [
      `Nom : ${nom}`,
      `Téléphone : ${tel}`,
      `Chien : ${chien}`,
      `Secteur : ${secteur}`,
      '',
      message,
    ].join('\n')

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Demande de balade — ${nom}`,
    )}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setSent(true)
  }

  return (
    <>
      {/* Bandeau image */}
      <section className="relative isolate">
        <img
          src="/img/banner-chien.jpeg"
          alt="Chien heureux en pleine nature"
          className="h-56 w-full object-cover sm:h-72"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-forest-900/45" />
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="font-display text-2xl font-600 text-cream sm:text-3xl">
            Offrez à votre chien des balades qui lui font du bien 💚
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-800 tracking-wide text-forest-500 uppercase">Contact</span>
            <h2 className="mt-3 font-display text-3xl font-600 text-forest-800 sm:text-4xl">
              Parlons de votre toutou
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-forest-900/70">
              Une question, une demande de balade, un doute sur votre secteur ? Écrivez-moi via ce
              formulaire — tout est centralisé ici, je vous réponds au plus vite. 🐶
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-forest-100 text-xl">
                  📍
                </span>
                <span className="text-forest-900/80">Carcassonne & alentours (Aude)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-forest-100 text-xl">
                  ✉️
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest-700 underline-offset-2 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-forest-100 sm:p-8">
            {sent ? (
              <div className="grid h-full place-items-center py-10 text-center">
                <div>
                  <p className="text-5xl">🐾</p>
                  <p className="mt-4 font-display text-2xl font-600 text-forest-700">Merci !</p>
                  <p className="mt-2 text-forest-900/70">
                    Votre logiciel de messagerie s'ouvre pour finaliser l'envoi. À très vite&nbsp;!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Votre nom" name="nom" required />
                  <Field label="Téléphone" name="tel" type="tel" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nom de votre chien" name="chien" />
                  <div>
                    <label className="mb-1.5 block text-sm font-700 text-forest-800" htmlFor="secteur">
                      Votre secteur
                    </label>
                    <select
                      id="secteur"
                      name="secteur"
                      className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-200"
                    >
                      {secteurs.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-700 text-forest-800" htmlFor="message">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Parlez-moi de votre chien, de vos attentes…"
                    className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-forest-600 px-6 py-3.5 font-700 text-cream shadow-md transition-colors hover:bg-forest-700"
                >
                  Envoyer ma demande
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-700 text-forest-800" htmlFor={name}>
        {label} {required && <span className="text-brick-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-200"
      />
    </div>
  )
}
