import { useState } from 'react'
import { Button, ChoiceGroup, Paragraph, Radio, Title } from '../../components'
import { ProfileAddress } from '../account/ProfileAddress'
import { PixPayment } from '../payments/PixPayment'

type CheckoutPageProps = {
  deliveryDate: string
  amount: number
  onPay: () => void
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function CheckoutPage({ deliveryDate, amount, onPay }: CheckoutPageProps) {
  const [method, setMethod] = useState('pix')

  return (
    <div className="checkout">
      <ProfileAddress submitLabel="Confirmar endereço" />

      <div className="panel">
        <Title as="h4">Entrega</Title>
        <Paragraph>
          Data prevista: <strong>{formatDay(deliveryDate)}</strong>
        </Paragraph>
      </div>

      <div className="panel">
        <Title as="h4">Pagamento</Title>
        <Paragraph variant="muted">Escolha como pagar este pedido.</Paragraph>
        <ChoiceGroup legend="Meio">
          <Radio
            name="pay"
            value="pix"
            checked={method === 'pix'}
            onChange={() => setMethod('pix')}
          >
            Pix — confirmação imediata
          </Radio>
          <Radio
            name="pay"
            value="credit"
            checked={method === 'credit'}
            onChange={() => setMethod('credit')}
          >
            Cartão de crédito — até 6x sem juros
          </Radio>
          <Radio
            name="pay"
            value="debit"
            checked={method === 'debit'}
            onChange={() => setMethod('debit')}
          >
            Cartão de débito
          </Radio>
          <Radio
            name="pay"
            value="boleto"
            checked={method === 'boleto'}
            onChange={() => setMethod('boleto')}
          >
            Boleto — até 2 dias úteis
          </Radio>
        </ChoiceGroup>

        {method === 'pix' ? <PixPayment amount={amount} /> : null}

        <div className="row">
          <Button onClick={onPay}>Pagar e finalizar</Button>
        </div>
      </div>
    </div>
  )
}
