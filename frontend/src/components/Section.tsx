import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'
import { Title } from './Title'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="block">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title as="h2">{title}</Title>
      {children}
    </section>
  )
}
