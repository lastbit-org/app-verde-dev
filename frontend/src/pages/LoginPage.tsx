import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { AuthForm } from '../features/auth/AuthForm'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function LoginPage() {
  return (
    <AppChrome withSidebars={false}>
      <main>
        <section className="hero">
          <Eyebrow>Acesso</Eyebrow>
          <Title as="h1">Entrar ou criar conta.</Title>
          <Paragraph variant="lead">
            Entre com e-mail e senha. A sessão fica num cookie httpOnly, não no
            navegador. Contas de exemplo: ana@example.com e bruno@example.com,
            senha verde123.
          </Paragraph>
        </section>

        <AuthForm />

        <p className="login-back">
          <Link to="/">Voltar à loja</Link>
          {' · '}
          <Link to="/user">Ver conta</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
