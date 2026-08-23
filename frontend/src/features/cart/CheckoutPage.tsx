import { useState } from 'react'
import { Button, ChoiceGroup, Paragraph, Radio, Title } from '../../components'
import type { Address, AddressInput } from '../../types/user'
import { ProfileAddress } from '../account/ProfileAddress'
import { formatAddress } from '../account/address'
import { PixPayment } from '../payments/PixPayment'

export const paymentLabels = {
  pix: 'Pix',
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  boleto: 'Boleto',
} as const

export type PaymentMethod = keyof typeof paymentLabels

type CheckoutPageProps = {
  deliveryDate: string
  amount: number
  paying: boolean
  address: Address | null
  savingAddress?: boolean
  addressError?: string | null
  onSaveAddress: (payload: AddressInput) => Promise<boolean>
  onPay: (payment: string) => void
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function CheckoutPage({
  deliveryDate,
  amount,
  paying,
  address,
  savingAddress = false,
  addressError = null,
  onSaveAddress,
  onPay,
}: CheckoutPageProps) {
  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [editingAddress, setEditingAddress] = useState(!address)

  async function saveAddress(payload: AddressInput) {
    const ok = await onSaveAddress(payload)
    if (ok) {
      setEditingAddress(false)
    }
    return ok
  }

  return (
    <div className="checkout">
      {editingAddress || !address ? (
        <ProfileAddress
          key={address?.id ?? 'checkout-address'}
          address={address}
          saving={savingAddress}
          error={addressError}
          submitLabel="Salvar endereço"
          submitVariant="ghost"
          onCancel={address ? () => setEditingAddress(false) : undefined}
          onSave={saveAddress}
        />
      ) : (
        <div className="panel">
          <Title as="h4">Endereço</Title>
          <Paragraph>{formatAddress(address)}</Paragraph>
          <div className="row">
            <Button variant="ghost" onClick={() => setEditingAddress(true)}>
              Editar
            </Button>
          </div>
        </div>
      )}

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

        <div className="row checkout-pay">
          <Button
            className="btn-block"
            disabled={paying || !address}
            onClick={() => onPay(paymentLabels[method])}
          >
            {paying
              ? 'Registrando…'
              : address
                ? 'Pagar e finalizar'
                : 'Informe o endereço para pagar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
