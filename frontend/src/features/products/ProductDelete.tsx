import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Paragraph } from '../../components'
import { canManageCatalog } from '../auth/roles'
import { useSession } from '../auth/SessionProvider'

type ProductDeleteProps = {
  name: string
  editTo: string
  removing: boolean
  error: string | null
  onDelete: () => Promise<boolean>
}

export function ProductDelete({
  name,
  editTo,
  removing,
  error,
  onDelete,
}: ProductDeleteProps) {
  const { user, loading } = useSession()
  const [confirming, setConfirming] = useState(false)

  if (loading || !canManageCatalog(user?.role)) {
    return null
  }

  return (
    <div className="product-admin">
      {confirming ? (
        <>
          <Paragraph>
            Excluir <strong>{name}</strong> da loja? Pedidos já feitos
            permanecem.
          </Paragraph>
          <div className="row">
            <Button disabled={removing} onClick={() => void onDelete()}>
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
        <p className="row product-links">
          <Link to={editTo}>Editar peça</Link>
          <button
            type="button"
            className="link-button"
            onClick={() => setConfirming(true)}
          >
            Excluir peça
          </button>
        </p>
      )}
      {error ? <p className="status status-error">{error}</p> : null}
    </div>
  )
}
