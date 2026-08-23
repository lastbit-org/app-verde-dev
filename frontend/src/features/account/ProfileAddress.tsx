import type { FormEvent } from 'react'
import { Button, Field, Input, Select, Title } from '../../components'
import type { Address, AddressInput } from '../../types/user'

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
  address?: Address | null
  saving?: boolean
  error?: string | null
  message?: string | null
  submitLabel?: string
  submitVariant?: 'primary' | 'secondary' | 'ghost'
  onCancel?: () => void
  onSave?: (payload: AddressInput) => Promise<boolean>
}

export function ProfileAddress({
  address = null,
  saving = false,
  error = null,
  message = null,
  submitLabel = 'Salvar endereço',
  submitVariant = 'primary',
  onCancel,
  onSave,
}: ProfileAddressProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!onSave) {
      return
    }

    const data = new FormData(event.currentTarget)
    await onSave({
      street: String(data.get('street') ?? ''),
      cep: String(data.get('cep') ?? ''),
      number: String(data.get('number') ?? ''),
      complement: String(data.get('complement') ?? ''),
      city: String(data.get('city') ?? ''),
      uf: String(data.get('uf') ?? ''),
    })
  }

  return (
    <div className="panel">
      <Title as="h4">Endereço</Title>
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Rua">
          <Input
            type="text"
            name="street"
            autoComplete="street-address"
            defaultValue={address?.street ?? ''}
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
              defaultValue={address?.cep ?? ''}
              required
            />
          </Field>
          <Field label="Número">
            <Input
              type="text"
              name="number"
              inputMode="numeric"
              defaultValue={address?.number ?? ''}
              required
            />
          </Field>
        </div>

        <Field label="Complemento">
          <Input
            type="text"
            name="complement"
            placeholder="Apto, bloco, referência"
            defaultValue={address?.complement ?? ''}
          />
        </Field>

        <div className="form-row">
          <Field label="Cidade">
            <Input
              type="text"
              name="city"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              required
            />
          </Field>
          <Field label="UF">
            <Select
              name="uf"
              defaultValue={address?.uf ?? 'SP'}
              options={ufs}
              required
            />
          </Field>
        </div>

        <div className="row">
          <Button type="submit" variant={submitVariant} disabled={saving}>
            {saving ? 'Salvando…' : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
