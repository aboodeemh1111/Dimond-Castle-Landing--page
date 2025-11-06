import { getTheme, type Theme } from '../lib/theme-api'

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

function generateThemeCSS(theme: Theme): string {
  const { brand, typography, designTokens } = theme
  const spacing = spacingMap[designTokens.spacingScale as keyof typeof spacingMap]
  
  return `
    :root {
      /* Brand Colors */
      --color-primary: ${brand.primaryColor};
      --color-secondary: ${brand.secondaryColor};
      --color-accent: ${brand.accentColor};
      --color-background: ${brand.backgroundColor};
      --color-surface: ${brand.surfaceColor};
      
      /* Typography */
      --font-en: ${typography.fontFamilyEN}, system-ui, sans-serif;
      --font-ar: ${typography.fontFamilyAR}, system-ui, sans-serif;
      --font-size-base: ${typography.baseFontSize}px;
      --font-weight-heading: ${typography.headingWeight};
      --font-weight-body: ${typography.bodyWeight};
      
      /* Design Tokens */
      --border-radius: ${borderRadiusMap[designTokens.borderRadius as keyof typeof borderRadiusMap]};
      --spacing-section: ${spacing.section};
      --spacing-container: ${spacing.container};
      --spacing-gap: ${spacing.gap};
      --shadow: ${shadowMap[designTokens.shadowLevel as keyof typeof shadowMap]};
    }
    
    body {
      font-family: var(--font-en);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-body);
      background-color: var(--color-background);
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

export default async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = await getTheme()
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
      {children}
    </>
  )
}

