import { useEffect, type ReactNode } from 'react'
import { useContent } from '../ContentContext'
import type { SiteContent } from '../content'
import Footer from '../components/Footer'

export type LegalKey = 'mentions' | 'confidentialite'
type LegalInfo = SiteContent['legal']

/** Affiche la valeur si renseignée, sinon un repère « à compléter ». */
function orTodo(value: string, todo: string): ReactNode {
  return value.trim() ? value : <Todo>{todo}</Todo>
}

const LAST_UPDATE = '13 août 2026'

/** Page légale (mentions légales / politique de confidentialité). */
export default function LegalPage({ page }: { page: LegalKey }) {
  const { contact, legal } = useContent()
  const email = contact.email || 'contact@rex-et-manon.fr'

  useEffect(() => {
    document.title =
      page === 'mentions' ? 'Mentions légales — Rex & Manon' : 'Politique de confidentialité — Rex & Manon'
  }, [page])

  return (
    <div className="min-h-screen bg-cream">
      <header className="container-page flex items-center justify-between gap-4 py-6">
        <a href="/">
          <img src="/brand/logo-horizontal-couleur.svg" alt="Rex & Manon" className="h-9 w-auto" />
        </a>
        <a href="/" className="text-sm font-700 text-forest-700 hover:text-orange-500">
          ← Retour au site
        </a>
      </header>

      <main className="container-page max-w-3xl pb-20">
        {page === 'mentions' ? (
          <MentionsLegales email={email} legal={legal} />
        ) : (
          <Confidentialite email={email} legal={legal} />
        )}
        <p className="mt-12 text-sm text-forest-900/50">Dernière mise à jour : {LAST_UPDATE}.</p>
      </main>

      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mentions légales                                                    */
/* ------------------------------------------------------------------ */

function MentionsLegales({ email, legal }: { email: string; legal: LegalInfo }) {
  return (
    <article>
      <H1>Mentions légales</H1>

      <H2>Éditeur du site</H2>
      <P>
        Le site <strong>rex-et-manon</strong> est édité par Manon Berthier, exerçant sous l’enseigne
        « Rex&nbsp;&&nbsp;Manon » (balades éducatives canines).
      </P>
      <Dl
        items={[
          ['Responsable de la publication', 'Manon Berthier'],
          ['Statut juridique', orTodo(legal.statut, 'à compléter (ex. entreprise individuelle / micro-entreprise)')],
          ['SIRET', orTodo(legal.siret, 'à compléter')],
          ['Adresse', orTodo(legal.adresse, 'à compléter (adresse postale de l’activité)')],
          ['Email', <a key="e" href={`mailto:${email}`} className="text-orange-500 hover:underline">{email}</a>],
        ]}
      />

      <H2>Hébergement</H2>
      <P>Le site et ses services s’appuient sur les prestataires suivants :</P>
      <Dl
        items={[
          [
            'Hébergement du site',
            'Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com',
          ],
          [
            'Base de données',
            'Supabase, Inc. — hébergement dans l’Union européenne (région Irlande) — supabase.com',
          ],
          [
            'Envoi des emails',
            'Resend, Inc. — 2261 Market Street #5039, San Francisco, CA 94114, États-Unis — resend.com',
          ],
        ]}
      />

      <H2>Propriété intellectuelle</H2>
      <P>
        L’ensemble des contenus (textes, photographies, logo, éléments graphiques) est la propriété de
        l’éditrice, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation écrite
        préalable est interdite.
      </P>

      <H2>Crédits</H2>
      <P>
        Conception et développement :{' '}
        <a
          href="https://pabloortega.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:underline"
        >
          Pablo Ortega
        </a>
        .
      </P>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Politique de confidentialité                                        */
/* ------------------------------------------------------------------ */

function Confidentialite({ email, legal }: { email: string; legal: LegalInfo }) {
  return (
    <article>
      <H1>Politique de confidentialité</H1>
      <P>
        Cette politique décrit comment les données personnelles transmises via ce site sont traitées,
        conformément au Règlement général sur la protection des données (RGPD).
      </P>

      <H2>Responsable de traitement</H2>
      <P>
        Manon Berthier (« Rex&nbsp;&&nbsp;Manon »). Pour toute question relative à vos données :{' '}
        <a href={`mailto:${email}`} className="text-orange-500 hover:underline">
          {email}
        </a>
        .
      </P>

      <H2>Données collectées</H2>
      <P>
        Via le formulaire de contact : nom, téléphone, nom du chien, secteur, message, et le cas échéant
        votre adresse email. Aucune donnée n’est collectée à votre insu.
      </P>

      <H2>Finalité et base légale</H2>
      <P>
        Ces données servent uniquement à répondre à votre demande et, le cas échéant, à organiser une
        prestation de balade. La base légale est votre consentement et l’exécution de mesures
        précontractuelles prises à votre demande.
      </P>

      <H2>Destinataires et sous-traitants</H2>
      <P>Vos données ne sont jamais vendues. Elles peuvent être traitées par les prestataires suivants :</P>
      <Dl
        items={[
          ['Vercel', 'hébergement du site et mesure d’audience (sans cookie) — États-Unis'],
          ['Supabase', 'stockage des données — Union européenne (Irlande)'],
          ['Resend', 'acheminement des emails — États-Unis'],
        ]}
      />
      <P>
        Les transferts hors Union européenne (Vercel, Resend) sont encadrés par des garanties appropriées
        (clauses contractuelles types et/ou Data Privacy Framework).
      </P>

      <H2>Durée de conservation</H2>
      <P>
        Vos données sont conservées le temps nécessaire au traitement de votre demande, puis{' '}
        {orTodo(legal.conservation, 'à compléter (ex. supprimées au bout de 12 mois sans suite)')}.
      </P>

      <H2>Cookies et mesure d’audience</H2>
      <P>
        Le site utilise Vercel Web Analytics, un outil de mesure d’audience <strong>sans cookie</strong> et
        sans traçage publicitaire. Aucun consentement préalable n’est donc requis.
      </P>

      <H2>Vos droits</H2>
      <P>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de
        portabilité de vos données. Pour les exercer, écrivez à{' '}
        <a href={`mailto:${email}`} className="text-orange-500 hover:underline">
          {email}
        </a>
        . Vous pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
          cnil.fr
        </a>
        ).
      </P>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Éléments de mise en forme                                           */
/* ------------------------------------------------------------------ */

function H1({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-3xl font-600 text-forest-700 sm:text-4xl">{children}</h1>
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 font-display text-xl font-600 text-forest-700">{children}</h2>
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-forest-900/75">{children}</p>
}

function Dl({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="mt-4 space-y-2">
      {items.map(([term, val], i) => (
        <div key={i} className="sm:flex sm:gap-2">
          <dt className="font-700 text-forest-800">{term} :</dt>
          <dd className="text-forest-900/75">{val}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Placeholder visible pour une information à renseigner par l’éditrice. */
function Todo({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700">[{children}]</mark>
  )
}
