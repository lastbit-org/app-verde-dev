import { useState, type FormEvent } from 'react'
import { Button, Checkbox, ChoiceGroup, Paragraph, Title } from '../../components'

export function UserPreferences() {
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Preferências salvas neste navegador.')
  }

  return (
    <div className="panel">
      <Title as="h4">Preferências</Title>
      <Paragraph variant="muted">
        Avisos da loja. Nada é enviado de verdade nesta entrega.
      </Paragraph>
      <form className="form" onSubmit={handleSubmit}>
        <ChoiceGroup legend="Comunicados">
          <Checkbox name="newsletter" defaultChecked>
            Novidades por e-mail
          </Checkbox>
          <Checkbox name="orders" defaultChecked>
            Atualizações de pedido
          </Checkbox>
          <Checkbox name="sms">
            Avisos por SMS
          </Checkbox>
        </ChoiceGroup>
        <div className="row">
          <Button type="submit">Salvar preferências</Button>
        </div>
      </form>
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
