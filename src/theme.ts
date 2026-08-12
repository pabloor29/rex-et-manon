import type { Theme } from './content'

// Les 4 couleurs de charte pilotent toute la palette : les nuances (100–900)
// sont dérivées par éclaircissement/assombrissement, puis injectées en variables
// CSS au runtime — elles surchargent les `--color-*` définies dans index.css
// (@theme de Tailwind v4), donc toutes les classes `bg-forest-600`, etc. suivent.

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

/** t > 0 : éclaircit vers le blanc ; t < 0 : assombrit vers le noir. */
function mix(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex)
  const target = t >= 0 ? 255 : 0
  const k = Math.abs(t)
  return rgbToHex(r + (target - r) * k, g + (target - g) * k, b + (target - b) * k)
}

// Échelle de dérivation par token (0 = couleur de base à son palier canonique).
const FOREST = { 50: 0.93, 100: 0.85, 200: 0.66, 300: 0.42, 400: 0.2, 500: 0.07, 600: 0, 700: -0.14, 800: -0.28, 900: -0.46 }
const ORANGE = { 100: 0.8, 200: 0.58, 300: 0.36, 400: 0.17, 500: 0, 600: -0.17 }
const LIME = { 200: 0.6, 300: 0.32, 400: 0, 500: -0.2 }

export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [step, t] of Object.entries(FOREST)) vars[`--color-forest-${step}`] = mix(theme.forest, t)
  for (const [step, t] of Object.entries(ORANGE)) vars[`--color-orange-${step}`] = mix(theme.orange, t)
  for (const [step, t] of Object.entries(LIME)) vars[`--color-lime-${step}`] = mix(theme.lime, t)
  vars['--color-cream'] = theme.cream
  vars['--color-cream-soft'] = mix(theme.cream, 0.35)
  vars['--color-cream-white'] = mix(theme.cream, 0.62)
  return vars
}

/** Applique le thème sur :root (surcharge les variables de couleur de la charte). */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  for (const [k, v] of Object.entries(themeToCssVars(theme))) root.style.setProperty(k, v)
}
