import { useState } from 'react'
import { Button, Field, Paragraph, Textarea, Title } from '../../components'

type PixPaymentProps = {
  amount: number
  merchant?: string
}

function tlv(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function pixPayload(amount: number, merchant: string) {
  const merchantAccount = tlv('00', 'br.gov.bcb.pix') + tlv('01', 'verde-atelier@pix.example')
  const payload =
    tlv('00', '01') +
    tlv('26', merchantAccount) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amount.toFixed(2)) +
    tlv('58', 'BR') +
    tlv('59', merchant.slice(0, 25)) +
    tlv('60', 'SAO PAULO') +
    tlv('62', tlv('05', '***')) +
    '6304SIMU'

  return payload
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function PixPayment({
  amount,
  merchant = 'VERDE ATELIER',
}: PixPaymentProps) {
  const code = pixPayload(amount, merchant)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(code)}`
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="pix">
      <Title as="h4">Pix</Title>
      <Paragraph variant="muted">
        Simulado. Não gera cobrança real. Valor {formatPrice(amount)}.
      </Paragraph>

      <div className="pix-body">
        <img
          className="pix-qr"
          src={qrUrl}
          alt="QR Code Pix simulado"
          width={160}
          height={160}
        />

        <div className="pix-copy">
          <Field label="Copia e cola">
            <Textarea readOnly rows={4} value={code} />
          </Field>
          <div className="row">
            <Button type="button" variant="secondary" onClick={() => void copyCode()}>
              {copied ? 'Copiado' : 'Copiar código'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
