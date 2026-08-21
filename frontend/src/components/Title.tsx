import type { ReactNode } from 'react'

type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
}

export function Title({ as: Tag = 'h2', children }: TitleProps) {
  return <Tag>{children}</Tag>
}
