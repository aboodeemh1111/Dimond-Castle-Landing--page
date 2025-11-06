'use client'

import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export default function ThemedButton({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  children,
  ...props 
}: Props) {
  const baseClasses = 'font-medium transition-all duration-200 inline-flex items-center justify-center'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      borderRadius: 'var(--border-radius)',
    },
    accent: {
      backgroundColor: 'var(--color-accent)',
      color: 'white',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow)',
    },
  }
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  )
}

