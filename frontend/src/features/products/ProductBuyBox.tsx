import { Button } from '../../components'

type ProductBuyBoxProps = {
  stock: number
  deliveryDate: string
  seller: string
  onBuy?: () => void
  onAddToCart?: () => void
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function Check() {
  return (
    <svg
      className="buybox-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.3 2.3 4.7-5" />
    </svg>
  )
}

export function ProductBuyBox({
  stock,
  deliveryDate,
  seller,
  onBuy,
  onAddToCart,
}: ProductBuyBoxProps) {
  const available = stock > 0

  return (
    <aside className="buybox" aria-label="Compra">
      <div className="buybox-actions">
        <Button
          className="btn-block"
          disabled={!available}
          onClick={onBuy}
        >
          {available ? 'Comprar agora' : 'Indisponível'}
        </Button>
        {onAddToCart ? (
          <Button
            className="btn-block"
            variant="secondary"
            disabled={!available}
            onClick={onAddToCart}
          >
            Adicionar ao carrinho
          </Button>
        ) : null}
      </div>

      <dl className="buybox-facts">
        <div>
          <dt>Estoque</dt>
          <dd>{available ? `${stock} unidades disponíveis` : 'Sem estoque'}</dd>
        </div>
        <div>
          <dt>Entrega prevista</dt>
          <dd>{formatDay(deliveryDate)}</dd>
        </div>
        <div>
          <dt>Vendido por</dt>
          <dd>{seller}</dd>
        </div>
      </dl>

      <ul className="buybox-perks">
        <li>
          <Check />
          Compra garantida
        </li>
        <li>
          <Check />
          Devolução grátis
        </li>
      </ul>
    </aside>
  )
}
