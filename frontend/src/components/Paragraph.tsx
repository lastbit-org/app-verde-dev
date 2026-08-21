import type { ReactNode } from 'react'

type ParagraphProps = {
  variant?: 'default' | 'lead' | 'muted'
  children: ReactNode
}

export function Paragraph({ variant = 'default', children }: ParagraphProps) {
  const className = variant === 'default' ? undefined : variant
  return <p className={className}>{children}</p>
}
