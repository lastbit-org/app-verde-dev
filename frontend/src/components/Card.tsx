import { Badge } from './Badge'
import { Paragraph } from './Paragraph'
import { Title } from './Title'

type CardProps = {
  badge?: string
  title: string
  description: string
  price: string
  image?: { src: string; alt: string }
}

export function Card({ badge, title, description, price, image }: CardProps) {
  const body = (
    <>
      {badge ? <Badge>{badge}</Badge> : null}
      <Title as="h3">{title}</Title>
      <Paragraph>{description}</Paragraph>
      <p className="price">{price}</p>
    </>
  )

  if (image) {
    return (
      <article className="card card-media">
        <img src={image.src} alt={image.alt} />
        <div className="card-body">{body}</div>
      </article>
    )
  }

  return <article className="card">{body}</article>
}
