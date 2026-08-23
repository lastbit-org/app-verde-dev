import { Link, useNavigate } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { AccountSection } from '../features/account/AccountSection'
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
    loading,
    saving,
    error,
    message,
    updateProfile,
    updatePassword,
    updateAddress,
    clear,
  } = useCurrentUser()
  const { orders, loading: ordersLoading, error: ordersError } = useOrders(
    Boolean(user),
  )
  const navigate = useNavigate()
  const mine = user ? orders.filter((order) => order.userId === user.id) : []

  async function signOut() {
    await clear()
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
        {!loading && !user ? (
          <p className="status">
            Entre para ver a conta.{' '}
            <Link to="/login">Ir ao login</Link>
          </p>
        ) : null}

        {user ? (
          <>
            <div className="user-head">
              <UserCard user={user} isDemo={false} />
              <UserStats orders={mine} />
            </div>

            <AccountSection
              name={user.name}
              email={user.email}
              cpf={user.cpf}
              address={user.address}
              saving={saving}
              error={error}
              message={message}
              onSavePersonal={updateProfile}
              onSavePassword={updatePassword}
              onSaveAddress={updateAddress}
            >
              <UserPreferences />
            </AccountSection>

            <UserOrders
              orders={mine}
              loading={ordersLoading}
              error={ordersError}
            />

            <p className="row product-links user-actions">
              <Link to="/products">Produtos</Link>
              <button
                type="button"
                className="link-button"
                onClick={() => void signOut()}
              >
                Sair
              </button>
            </p>
          </>
        ) : null}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
