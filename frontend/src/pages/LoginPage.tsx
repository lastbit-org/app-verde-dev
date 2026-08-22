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
            Cadastro envia nome e e-mail para <code>POST /users</code>. Login
            confere o e-mail em <code>POST /users/login</code>.
          </Paragraph>
        </section>

        <AuthForm />

        <p className="login-back">
          <Link to="/">Voltar à loja</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
