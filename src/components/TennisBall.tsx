type Variant = 'couleur' | 'blanc' | 'noir'

/** Élément graphique de la charte : la balle de tennis. */
export default function TennisBall({
  variant = 'couleur',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  return (
    <img
      src={`/brand/balle-${variant}.svg`}
      alt=""
      aria-hidden
      className={className}
      loading="lazy"
    />
  )
}
