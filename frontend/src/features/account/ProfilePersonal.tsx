import type { FormEvent } from 'react'
import { Button, Field, Input, Title } from '../../components'

type ProfilePersonalProps = {
  name?: string
  email?: string
  cpf?: string
}

export function ProfilePersonal({
  name = 'Ana Silva',
  email = 'ana@example.com',
  cpf = '123.456.789-00',
}: ProfilePersonalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="panel">
      <Title as="h4">Informações pessoais</Title>
      <form className="form" onSubmit={handleSubmit}>
        <Field label="Nome">
          <Input
            type="text"
            name="name"
            autoComplete="name"
            defaultValue={name}
            required
          />
        </Field>
        <Field label="E-mail">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={email}
            required
          />
        </Field>
        <Field label="CPF">
          <Input
            type="text"
            name="cpf"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            defaultValue={cpf}
            required
          />
        </Field>
        <div className="row">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  )
}
