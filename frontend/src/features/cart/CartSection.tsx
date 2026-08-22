import { useState } from 'react'
import { createOrderInput } from '../../api/orders'
import { Paragraph, Section } from '../../components'
import type { CreateOrderInput, Order } from '../../types/order'
import { CartPage } from './CartPage'
import { CheckoutPage } from './CheckoutPage'
import { initialCart } from './cartData'

type CartSectionProps = {
  userId?: number
  onAddOrder: (payload: CreateOrderInput) => Promise<Order>
}

export function CartSection({ userId = 1, onAddOrder }: CartSectionProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [items, setItems] = useState(initialCart)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<Order | null>(null)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function increase(id: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }

  function decrease(id: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    )
  }

  async function addOrder(payment: string) {
    setPaying(true)
    setError(null)

    try {
      const order = await onAddOrder(
        createOrderInput(
          items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: 0,
          })),
          payment,
          userId,
        ),
      )
      setCreated(order)
    } catch {
      setError('Não foi possível registrar o pedido. Confira se a API está no ar.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <Section id="carrinho" eyebrow="Pedido" title={step === 'cart' ? 'Carrinho' : 'Checkout'}>
      {step === 'cart' ? (
        <CartPage
          items={items}
          onIncrease={increase}
          onDecrease={decrease}
          onContinue={() => {
            setCreated(null)
            setError(null)
            setStep('checkout')
          }}
        />
      ) : (
        <>
          <Paragraph>
            Confirme o endereço, a entrega e o meio de pagamento.
          </Paragraph>
          <CheckoutPage
            deliveryDate="2026-08-28"
            amount={total}
            paying={paying}
            onPay={(payment) => void addOrder(payment)}
          />
          {error ? <p className="status status-error">{error}</p> : null}
          {created ? (
            <p className="status status-ok">
              Pedido {created.orderId} registrado. Pagamento simulado nesta entrega.
            </p>
          ) : null}
        </>
      )}
    </Section>
  )
}
