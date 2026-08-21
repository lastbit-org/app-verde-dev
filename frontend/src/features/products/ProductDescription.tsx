import { Paragraph, Title } from '../../components'

type ProductDetail = {
  label: string
  value: string
}

type ProductDescriptionProps = {
  name: string
  price: number
  text: string
  details?: ProductDetail[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function ProductDescription({
  name,
  price,
  text,
  details = [],
}: ProductDescriptionProps) {
  const paragraphs = text.split('\n\n')

  return (
    <article className="product-copy">
      <Title as="h3">{name}</Title>
      <p className="price product-copy-price">{formatPrice(price)}</p>

      {paragraphs.map((paragraph) => (
        <Paragraph key={paragraph}>{paragraph}</Paragraph>
      ))}

      {details.length > 0 ? (
        <dl className="product-copy-details">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  )
}
