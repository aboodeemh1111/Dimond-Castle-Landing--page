import { ReactNode, CSSProperties } from 'react'

type Props = {
  children: ReactNode
  className?: string
  background?: 'default' | 'surface' | 'primary' | 'secondary'
  spacing?: 'tight' | 'normal' | 'spacious'
  style?: CSSProperties
}

export default function ThemedSection({ 
  children, 
  className = '', 
  background = 'default',
  spacing,
  style = {}
}: Props) {
  const backgroundColors = {
    default: 'var(--color-background)',
    surface: 'var(--color-surface)',
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
  }
  
  const paddingValue = spacing 
    ? `var(--spacing-section)` 
    : 'var(--spacing-section)'
  
  return (
    <section
      className={className}
      style={{
        backgroundColor: backgroundColors[background],
        paddingTop: paddingValue,
        paddingBottom: paddingValue,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

