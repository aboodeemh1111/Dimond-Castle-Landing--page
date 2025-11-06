// Helper functions to use theme values in components

export function getThemeColor(color: 'primary' | 'secondary' | 'accent' | 'background' | 'surface'): string {
  return `var(--color-${color})`
}

export function getThemeFont(locale: 'en' | 'ar'): string {
  return locale === 'ar' ? 'var(--font-ar)' : 'var(--font-en)'
}

export function getThemeSpacing(type: 'section' | 'container' | 'gap'): string {
  return `var(--spacing-${type})`
}

export function getThemeBorderRadius(): string {
  return 'var(--border-radius)'
}

export function getThemeShadow(): string {
  return 'var(--shadow)'
}

// Tailwind-compatible class helpers
export const themeClasses = {
  primary: 'text-[var(--color-primary)] bg-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)] bg-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)] bg-[var(--color-accent)]',
  surface: 'bg-[var(--color-surface)]',
  rounded: 'rounded-[var(--border-radius)]',
  shadow: 'shadow-[var(--shadow)]',
}

