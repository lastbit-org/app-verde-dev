import { Button, ChoiceGroup, Paragraph, Radio, Title } from '../../components'
import { ProfileAddress } from '../account/ProfileAddress'

type CheckoutPageProps = {
  deliveryDate: string
  onPay: () => void
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function CheckoutPage({ deliveryDate, onPay }: CheckoutPageProps) {
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
          <Radio name="pay" value="pix" defaultChecked>
            Pix — confirmação imediata
          </Radio>
          <Radio name="pay" value="credit">
            Cartão de crédito — até 6x sem juros
          </Radio>
          <Radio name="pay" value="debit">
            Cartão de débito
          </Radio>
          <Radio name="pay" value="boleto">
            Boleto — até 2 dias úteis
          </Radio>
        </ChoiceGroup>
        <div className="row">
          <Button onClick={onPay}>Pagar e finalizar</Button>
        </div>
      </div>
    </div>
  )
}
