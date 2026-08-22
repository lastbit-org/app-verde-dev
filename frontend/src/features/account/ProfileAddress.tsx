import type { FormEvent } from 'react'
import { Button, Field, Input, Select, Title } from '../../components'

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
].map((uf) => ({ value: uf, label: uf }))

type ProfileAddressProps = {
  street?: string
  cep?: string
  number?: string
  complement?: string
  city?: string
  uf?: string
}

export function ProfileAddress({
  street = 'Rua das Oliveiras',
  cep = '01310-100',
  number = '120',
  complement = 'Apto 42',
  city = 'São Paulo',
  uf = 'SP',
}: ProfileAddressProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="panel">
      <Title as="h4">Endereço</Title>
      <form className="form" onSubmit={handleSubmit}>
        <Field label="Rua">
          <Input
            type="text"
            name="street"
            autoComplete="street-address"
            defaultValue={street}
            required
          />
        </Field>

        <div className="form-row">
          <Field label="CEP">
            <Input
              type="text"
              name="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              defaultValue={cep}
              required
            />
          </Field>
          <Field label="Número">
            <Input
              type="text"
              name="number"
              inputMode="numeric"
              defaultValue={number}
              required
            />
          </Field>
        </div>

        <Field label="Complemento">
          <Input
            type="text"
            name="complement"
            placeholder="Apto, bloco, referência"
            defaultValue={complement}
          />
        </Field>

        <div className="form-row">
          <Field label="Cidade">
            <Input
              type="text"
              name="city"
              autoComplete="address-level2"
              defaultValue={city}
              required
            />
          </Field>
          <Field label="UF">
            <Select name="uf" defaultValue={uf} options={ufs} required />
          </Field>
        </div>

        <div className="row">
          <Button type="submit">Salvar endereço</Button>
        </div>
      </form>
    </div>
  )
}
