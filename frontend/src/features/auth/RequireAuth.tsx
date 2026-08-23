import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Paragraph, Title } from '../../components'
import { AppChrome, PageFooter } from '../../layout/AppChrome'
import type { UserRole } from './roles'
import { useSession } from './SessionProvider'

type RequireAuthProps = {
  children: ReactNode
  roles?: UserRole[]
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, loading } = useSession()
  const location = useLocation()

  if (loading) {
    return (
      <AppChrome>
        <main>
          <p className="status">Carregando sessão…</p>
        </main>
        <PageFooter />
      </AppChrome>
    )
  }

  if (!user) {
    const next = `${location.pathname}${location.search}${location.hash}`
    return (
      <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
    )
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <AppChrome>
        <main>
          <section className="hero">
            <Title as="h1">Acesso restrito.</Title>
            <Paragraph variant="lead">
              {roles.length === 1 && roles[0] === 'admin'
                ? 'Esta página é só para administradores.'
                : 'Esta página é só para administradores e parceiros.'}
            </Paragraph>
          </section>
          <p className="row product-links">
            <Link to="/">Voltar à loja</Link>
            <Link to="/user">Ver conta</Link>
          </p>
        </main>
        <PageFooter />
      </AppChrome>
    )
  }

  return children
}
