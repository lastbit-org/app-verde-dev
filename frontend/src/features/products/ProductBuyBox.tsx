import { CheckCircle } from '@phosphor-icons/react'
import { Button } from '../../components'

type ProductBuyBoxProps = {
  stock: number
  deliveryDate: string
  seller: string
  favorited?: boolean
  favoriteBusy?: boolean
  onBuy?: () => void
  onAddToCart?: () => void
  onToggleFavorite?: () => void
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function ProductBuyBox({
  stock,
  deliveryDate,
  seller,
  favorited = false,
  favoriteBusy = false,
  onBuy,
  onAddToCart,
  onToggleFavorite,
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
        {onToggleFavorite ? (
          <Button
            className="btn-block"
            variant="ghost"
            disabled={favoriteBusy}
            onClick={onToggleFavorite}
          >
            {favoriteBusy
              ? 'Salvando…'
              : favorited
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'}
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
          <CheckCircle className="buybox-icon" size={16} weight="regular" aria-hidden />
          Compra garantida
        </li>
        <li>
          <CheckCircle className="buybox-icon" size={16} weight="regular" aria-hidden />
          Devolução grátis
        </li>
      </ul>
    </aside>
  )
}
