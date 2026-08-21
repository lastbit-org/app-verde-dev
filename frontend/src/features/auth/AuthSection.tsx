import { Paragraph, Section } from '../../components'
import { AuthForm } from './AuthForm'

export function AuthSection() {
  return (
    <Section id="conta" eyebrow="Acesso" title="Entrar ou criar conta">
      <Paragraph>
        Cadastro envia nome e e-mail para <code>POST /users</code>. Login
        confere o e-mail em <code>POST /users/login</code>.
      </Paragraph>
      <AuthForm />
    </Section>
  )
}
