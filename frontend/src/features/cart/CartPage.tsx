import { Button, Paragraph, Title } from '../../components'
import type { CartItem } from './cartData'

type CartPageProps = {
  items: CartItem[]
  onIncrease: (id: number) => void
  onDecrease: (id: number) => void
  onContinue: () => void
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function CartPage({
  items,
  onIncrease,
  onDecrease,
  onContinue,
}: CartPageProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart">
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-line">
            <img src={item.image.src} alt={item.image.alt} />
            <div className="cart-line-info">
              <Title as="h4">{item.name}</Title>
              <Paragraph variant="muted">{item.description}</Paragraph>
              <button type="button" className="cart-remove">
                Remover
              </button>
            </div>
            <div className="cart-qty">
              <button
                type="button"
                aria-label={`Diminuir ${item.name}`}
                onClick={() => onDecrease(item.id)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Aumentar ${item.name}`}
                onClick={() => onIncrease(item.id)}
              >
                +
              </button>
            </div>
            <div className="cart-price">
              {item.originalPrice ? (
                <s>{formatPrice(item.originalPrice * item.quantity)}</s>
              ) : null}
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <p className="cart-total">
          Total <strong>{formatPrice(total)}</strong>
        </p>
        <Button onClick={onContinue}>Continuar</Button>
      </div>
    </div>
  )
}
