import type { ReactNode } from 'react'

type QuoteProps = {
  children: ReactNode
}

export function Quote({ children }: QuoteProps) {
  return <blockquote>{children}</blockquote>
}
