import type { FormEvent } from 'react'
import { Button, Field, Input } from '../../components'
import { useAuth } from './useAuth'

export function AuthForm() {
  const { mode, switchMode, loading, error, message, submit } = useAuth()
  const isSignup = mode === 'signup'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    void submit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      password: String(data.get('password') ?? ''),
    })
  }

  return (
    <div className="auth">
      <div className="auth-tabs" role="tablist" aria-label="Acesso">
        <button
          type="button"
          role="tab"
          className={`auth-tab${mode === 'login' ? ' is-active' : ''}`}
          aria-selected={mode === 'login'}
          onClick={() => switchMode('login')}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          className={`auth-tab${isSignup ? ' is-active' : ''}`}
          aria-selected={isSignup}
          onClick={() => switchMode('signup')}
        >
          Criar conta
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {isSignup ? (
          <Field label="Nome">
            <Input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ana Silva"
              required
            />
          </Field>
        ) : null}

        <Field label="E-mail">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="ana@example.com"
            required
          />
        </Field>

        <Field label="Senha">
          <Input
            type="password"
            name="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </Field>

        <div className="row">
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando…' : isSignup ? 'Criar conta' : 'Entrar'}
          </Button>
        </div>
      </form>

      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
