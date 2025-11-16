import { getTheme, type Theme } from '../lib/theme-api'
import { ThemeClientProvider } from './ThemeContext'

const borderRadiusMap = {
  none: '0px',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}

const spacingMap = {
  tight: { section: '2rem', container: '1rem', gap: '1rem' },
  normal: { section: '4rem', container: '1.5rem', gap: '1.5rem' },
  spacious: { section: '6rem', container: '2rem', gap: '2rem' },
}

const shadowMap = {
  none: 'none',
  soft: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function adjustColor(hex: string, amount: number) {
  const normalized = clamp(amount, -1, 1)
  const cleanHex = hex?.trim().replace('#', '')
  if (!cleanHex || cleanHex.length !== 6) return hex
  const num = Number.parseInt(cleanHex, 16)
  if (Number.isNaN(num)) return hex
  const delta = Math.round(255 * normalized)
  const r = clamp(((num >> 16) & 0xff) + delta, 0, 255)
  const g = clamp(((num >> 8) & 0xff) + delta, 0, 255)
  const b = clamp((num & 0xff) + delta, 0, 255)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

function generateThemeCSS(theme: Theme): string {
  const { brand, typography, designTokens } = theme
  const spacing = spacingMap[designTokens.spacingScale as keyof typeof spacingMap] || spacingMap.normal
  const borderRadius = borderRadiusMap[designTokens.borderRadius as keyof typeof borderRadiusMap] || borderRadiusMap.lg
  const shadow = shadowMap[designTokens.shadowLevel as keyof typeof shadowMap] || shadowMap.base

  const primary = brand.primaryColor || '#2C5E47'
  const primaryDark = adjustColor(primary, -0.15)
  const secondary = brand.secondaryColor || '#1A3A2E'
  const accent = brand.accentColor || '#D4AF37'
  const accentDark = adjustColor(accent, -0.2)
  const background = brand.backgroundColor || '#F9F7F3'
  const surface = brand.surfaceColor || '#FFFFFF'
  const gray = adjustColor(secondary, 0.35)
  const accentSoft = adjustColor(accent, 0.25)

  return `
    :root {
      /* Brand Colors */
      --color-primary: ${primary};
      --color-primary-600: ${primaryDark};
      --color-secondary: ${secondary};
      --color-accent: ${accent};
      --color-accent-strong: ${accentDark};
      --color-background: ${background};
      --color-surface: ${surface};
      --color-foreground: ${secondary};

      /* Legacy tokens */
      --green-500: ${primary};
      --green-600: ${primaryDark};
      --gold-500: ${accent};
      --gold-600: ${accentDark};
      --dc-bg: ${background};
      --dc-white: ${surface};
      --dc-text: ${secondary};
      --dc-gray: ${gray};
      --dc-accent: ${accentSoft};
      
      /* Typography */
      --font-en: ${typography.fontFamilyEN}, system-ui, sans-serif;
      --font-ar: ${typography.fontFamilyAR}, system-ui, sans-serif;
      --font-size-base: ${typography.baseFontSize}px;
      --font-weight-heading: ${typography.headingWeight};
      --font-weight-body: ${typography.bodyWeight};
      
      /* Design Tokens */
      --border-radius: ${borderRadius};
      --spacing-section: ${spacing.section};
      --spacing-container: ${spacing.container};
      --spacing-gap: ${spacing.gap};
      --shadow: ${shadow};
    }
    
    body {
      font-family: var(--font-en);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-body);
      background-color: var(--color-background);
      color: var(--color-foreground);
    }
    
    [dir="rtl"] body {
      font-family: var(--font-ar);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: var(--font-weight-heading);
      color: var(--color-primary);
    }
  `
}

export default async function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) {
  const theme = initialTheme ?? (await getTheme())

  return (
    <ThemeClientProvider theme={theme}>
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
      {children}
    </ThemeClientProvider>
  )
}

