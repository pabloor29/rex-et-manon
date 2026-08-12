import { useState, type FormEvent } from 'react'
import { useContent } from '../ContentContext'

export default function Contact() {
  const { contact } = useContent()
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

    const href = `mailto:${contact.email}?subject=${encodeURIComponent(
      `Demande de balade — ${nom}`,
    )}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setSent(true)
  }

  return (
    <>
      {/* Bandeau image + texte positionné */}
      <section className="relative isolate">
        <img
          src={contact.photo.src}
          alt={contact.photo.alt}
          className="h-64 w-full object-cover sm:h-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-forest-900/55" />
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="max-w-2xl font-display text-2xl font-600 text-cream-white sm:text-3xl">
            {contact.bannerText}
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-800 tracking-wide text-orange-500 uppercase">{contact.eyebrow}</span>
            <h2 className="mt-3 font-display text-3xl font-600 text-forest-700 sm:text-4xl">{contact.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-forest-900/70">{contact.text}</p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-lime-400/25 text-xl ring-1 ring-lime-400/40">
                  📍
                </span>
                <span className="text-forest-900/80">{contact.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-lime-400/25 text-xl ring-1 ring-lime-400/40">
                  ✉️
                </span>
                <a href={`mailto:${contact.email}`} className="text-orange-500 underline-offset-2 hover:underline">
                  {contact.email}
                </a>
              </li>
              {contact.phone && (
                <li className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-lime-400/25 text-xl ring-1 ring-lime-400/40">
                    📞
                  </span>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-orange-500 underline-offset-2 hover:underline">
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl bg-cream-white p-6 shadow-lg ring-1 ring-forest-100 sm:p-8">
            {sent ? (
              <div className="grid h-full place-items-center py-10 text-center">
                <div>
                  <p className="text-5xl">🐾</p>
                  <p className="mt-4 font-display text-2xl font-600 text-forest-700">Merci !</p>
                  <p className="mt-2 text-forest-900/70">
                    Votre logiciel de messagerie s’ouvre pour finaliser l’envoi. À très vite&nbsp;!
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
                      className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                      {contact.secteurs.map((s) => (
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
                    className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-orange-500 px-6 py-3.5 font-700 text-white shadow-md transition-colors hover:bg-orange-600"
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
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-forest-100 bg-cream px-4 py-3 text-forest-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />
    </div>
  )
}
