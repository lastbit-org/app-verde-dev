import { Link } from 'react-router-dom'
import { Paragraph, Title } from '../../components'

type PaymentMethod = {
  name: string
  detail: string
}

type ProductPaymentsProps = {
  methods?: PaymentMethod[]
}

const defaultMethods: PaymentMethod[] = [
  {
    name: 'Pix',
    detail: 'Pagamento à vista, confirmação imediata.',
  },
  {
    name: 'Cartão de crédito',
    detail: 'Visa, Mastercard e Elo, em até 6x sem juros.',
  },
  {
    name: 'Cartão de débito',
    detail: 'Débito à vista nas mesmas bandeiras.',
  },
  {
    name: 'Boleto',
    detail: 'Compensação em até 2 dias úteis.',
  },
]

export function ProductPayments({
  methods = defaultMethods,
}: ProductPaymentsProps) {
  return (
    <section className="payments" aria-labelledby="payments-title">
      <Title as="h4">Meios de pagamento</Title>
      <Paragraph variant="muted">
        Informações da loja. O pagamento acontece na página de checkout.
      </Paragraph>
      <ul className="payments-list">
        {methods.map((method) => (
          <li key={method.name}>
            <strong>{method.name}</strong>
            <span>{method.detail}</span>
          </li>
        ))}
      </ul>
      <p className="payments-go">
        <Link to="/cart">Ver carrinho</Link>
        {' · '}
        <Link to="/checkout">Ir ao pagamento</Link>
      </p>
    </section>
  )
}
