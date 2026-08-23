import { useState } from 'react'
import { Button, Paragraph } from '../../components'
import { useSession } from '../auth/SessionProvider'

type ProductDeleteProps = {
  name: string
  removing: boolean
  error: string | null
  onDelete: () => Promise<boolean>
}

export function ProductDelete({
  name,
  removing,
  error,
  onDelete,
}: ProductDeleteProps) {
  const { user, loading } = useSession()
  const [confirming, setConfirming] = useState(false)

  if (loading || !user) {
    return null
  }

  return (
    <div className="product-delete">
      {confirming ? (
        <>
          <Paragraph>
            Excluir <strong>{name}</strong> da loja? Pedidos já feitos
            permanecem.
          </Paragraph>
          <div className="row">
            <Button
              disabled={removing}
              onClick={() => void onDelete()}
            >
              {removing ? 'Excluindo…' : 'Confirmar exclusão'}
            </Button>
            <Button
              variant="ghost"
              disabled={removing}
              onClick={() => setConfirming(false)}
            >
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          Excluir peça
        </Button>
      )}
      {error ? <p className="status status-error">{error}</p> : null}
    </div>
  )
}
