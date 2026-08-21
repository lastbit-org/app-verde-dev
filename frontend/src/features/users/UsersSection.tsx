import { Button, Paragraph, Section } from '../../components'
import { UserList } from './UserList'
import { useUsers } from './useUsers'

export function UsersSection() {
  const { users, loading, error, loadUsers } = useUsers()

  return (
    <Section id="api" eyebrow="Integração" title="Usuários da API">
      <Paragraph>
        O botão chama <code>GET /users</code> no backend e lista o retorno nesta
        página.
      </Paragraph>

      <div className="row">
        <Button onClick={() => void loadUsers()} disabled={loading}>
          {loading ? 'Carregando…' : 'Buscar usuários'}
        </Button>
      </div>

      {error ? <p className="status status-error">{error}</p> : null}

      <UserList users={users} />
    </Section>
  )
}
