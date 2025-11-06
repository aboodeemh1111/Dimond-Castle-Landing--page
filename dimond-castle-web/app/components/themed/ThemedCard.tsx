import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export default function ThemedCard({ children, className = '', padding = 'md' }: Props) {
  const paddingMap = {
    sm: 'var(--spacing-container)',
    md: 'calc(var(--spacing-container) * 1.5)',
    lg: 'calc(var(--spacing-container) * 2)',
  }
  
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        padding: paddingMap[padding],
      }}
    >
      {children}
    </div>
  )
}

