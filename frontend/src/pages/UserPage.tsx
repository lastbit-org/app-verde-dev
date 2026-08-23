import { Link, useNavigate } from 'react-router-dom'
import { Button, Eyebrow, Paragraph, Title } from '../components'
import { AccountSection } from '../features/account/AccountSection'
import { useSession } from '../features/auth/SessionProvider'
import { useOrders } from '../features/orders/useOrders'
import { UserCard } from '../features/user/UserCard'
import { UserOrders } from '../features/user/UserOrders'
import { UserPreferences } from '../features/user/UserPreferences'
import { UserStats } from '../features/user/UserStats'
import { useCurrentUser } from '../features/user/useCurrentUser'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function UserPage() {
  const {
    user,
    isDemo,
    loading,
    saving,
    error,
    message,
    updateProfile,
    clear,
  } = useCurrentUser()
  const session = useSession()
  const { orders, loading: ordersLoading, error: ordersError } = useOrders()
  const navigate = useNavigate()
  const mine = user ? orders.filter((order) => order.userId === user.id) : []

  function signOut() {
    clear()
    navigate('/login')
  }

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Conta</Eyebrow>
          <Title as="h1">
            {user ? `Olá, ${user.name.split(' ')[0]}.` : 'Sua conta.'}
          </Title>
          <Paragraph variant="lead">
            Dados pessoais, endereço, segurança e pedidos desta conta.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando usuário…</p> : null}
        {error && !user ? <p className="status status-error">{error}</p> : null}

        {user ? (
          <>
            <div className="user-head">
              <UserCard user={user} isDemo={isDemo} />
              <UserStats orders={mine} />
            </div>

            <AccountSection
              name={user.name}
              email={user.email}
              cpf={user.cpf}
              saving={saving}
              error={error}
              message={message}
              onSavePersonal={updateProfile}
            >
              <UserPreferences />
            </AccountSection>

            <UserOrders
              orders={mine}
              loading={ordersLoading}
              error={ordersError}
            />

            <div className="row user-actions">
              {session.user ? (
                <Button variant="ghost" onClick={signOut}>
                  Sair
                </Button>
              ) : (
                <Link to="/login">Entrar ou criar conta</Link>
              )}
            </div>
          </>
        ) : null}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
