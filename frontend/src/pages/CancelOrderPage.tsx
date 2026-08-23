import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cancelOrder, getOrder } from '../api/orders'
import { ApiError } from '../api/client'
import {
  Button,
  Checkbox,
  ChoiceGroup,
  Eyebrow,
  Paragraph,
  Radio,
  Textarea,
  Title,
} from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { AppChrome, PageFooter } from '../layout/AppChrome'
import type { CancelReason, Order } from '../types/order'

const reasons: { value: CancelReason; label: string }[] = [
  { value: 'changed_mind', label: 'Desisti da compra' },
  { value: 'wrong_item', label: 'Pedi o item errado' },
  { value: 'too_slow', label: 'A entrega está demorando' },
  { value: 'found_cheaper', label: 'Encontrei um preço melhor' },
  { value: 'other', label: 'Outro motivo' },
]

function canCancel(order: Order) {
  return order.status !== 'entregue' && order.status !== 'cancelado'
}

export function CancelOrderPage() {
  const { orderId } = useParams()
  const id = Number(orderId)
  const { user } = useSession()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState<CancelReason>('changed_mind')
  const [details, setDetails] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!Number.isInteger(id) || id < 1) {
      setLoading(false)
      setError('Pedido inválido.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void getOrder(id)
      .then((next) => {
        if (!cancelled) {
          setOrder(next)
        }
      })
      .catch((err) => {
        if (cancelled) {
          return
        }
        setOrder(null)
        if (err instanceof ApiError && err.status === 403) {
          setError('Este pedido não pertence à sua conta.')
        } else if (err instanceof ApiError && err.status === 404) {
          setError('Pedido não encontrado.')
        } else {
          setError('Não foi possível carregar o pedido.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!order || !confirmed) {
      return
    }

    if (reason === 'other' && !details.trim()) {
      setError('Descreva o motivo do cancelamento.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await cancelOrder(order.id, {
        reason,
        details: details.trim() || undefined,
      })
      navigate('/purchases', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError('Este pedido não pode mais ser cancelado.')
      } else {
        setError('Não foi possível cancelar. Tente de novo.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Conta</Eyebrow>
          <Title as="h1">Cancelar pedido</Title>
          <Paragraph variant="lead">
            Conte o motivo e confirme. Só pedidos ainda não entregues podem ser
            cancelados.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando pedido…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        {!loading && order && !canCancel(order) ? (
          <p className="status">
            O pedido {order.orderId} está {order.status} e não pode ser
            cancelado.{' '}
            <Link to="/purchases">Voltar às compras</Link>
          </p>
        ) : null}

        {!loading && order && canCancel(order) ? (
          <form className="form cancel-form" onSubmit={(event) => void submit(event)}>
            <div className="panel">
              <Title as="h3">{order.orderId}</Title>
              <Paragraph>
                {order.items
                  .map((item) => `${item.quantity}× ${item.name}`)
                  .join(', ')}
              </Paragraph>
            </div>

            <ChoiceGroup legend="Por que você quer cancelar?">
              {reasons.map((option) => (
                <Radio
                  key={option.value}
                  name="reason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={() => setReason(option.value)}
                >
                  {option.label}
                </Radio>
              ))}
            </ChoiceGroup>

            <label className="field">
              <span>
                {reason === 'other'
                  ? 'Descreva o motivo'
                  : 'Quer acrescentar alguma coisa? (opcional)'}
              </span>
              <Textarea
                name="details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                maxLength={400}
                required={reason === 'other'}
              />
            </label>

            <Checkbox
              name="confirm"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.currentTarget.checked)}
              required
            >
              Confirmo o cancelamento deste pedido.
            </Checkbox>

            <div className="row">
              <Button type="submit" disabled={saving || !user}>
                {saving ? 'Cancelando…' : 'Confirmar cancelamento'}
              </Button>
              <Link to="/purchases">Voltar</Link>
            </div>
          </form>
        ) : null}

        {!loading && !order && !error ? (
          <p className="status">
            <Link to="/purchases">Voltar às compras</Link>
          </p>
        ) : null}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
