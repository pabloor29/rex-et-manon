/** Bord festonné / vague type "store" — élément graphique repris de la charte
 *  (la bande crème à demi-cercles sous le logo). À poser en bas d'une bande de couleur. */
export default function Scallop({
  className = '',
  color = 'bg-cream',
}: {
  className?: string
  color?: string
}) {
  return <div aria-hidden className={`scallop-bottom pointer-events-none h-5 w-full ${color} ${className}`} />
}
