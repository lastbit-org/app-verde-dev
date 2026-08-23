import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { UserList } from '../features/users/UserList'
import { useUsers } from '../features/users/useUsers'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function UsersTablePage() {
  const { users, loading, error } = useUsers(true)

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Admin</Eyebrow>
          <Title as="h1">Todos os usuários</Title>
          <Paragraph variant="lead">
            Contas cadastradas na loja. Só o administrador vê esta lista.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando usuários…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}
        {!loading && users.length === 0 && !error ? (
          <p className="status">Nenhum usuário encontrado.</p>
        ) : null}

        <UserList users={users} />

        <p className="row product-links">
          <Link to="/products">Ver produtos</Link>
          <Link to="/orders">Ver pedidos</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
