import { useState } from 'react'
import { Paragraph, Section } from '../../components'
import { CartPage } from './CartPage'
import { CheckoutPage } from './CheckoutPage'
import { initialCart } from './cartData'

export function CartSection() {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [items, setItems] = useState(initialCart)
  const [done, setDone] = useState(false)

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

  return (
    <Section id="carrinho" eyebrow="Pedido" title={step === 'cart' ? 'Carrinho' : 'Checkout'}>
      {step === 'cart' ? (
        <CartPage
          items={items}
          onIncrease={increase}
          onDecrease={decrease}
          onContinue={() => {
            setDone(false)
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
            onPay={() => setDone(true)}
          />
          {done ? (
            <p className="status status-ok">Pedido registrado. Pagamento simulado nesta entrega.</p>
          ) : null}
        </>
      )}
    </Section>
  )
}
