import { useCallback, useState } from 'react'
import { ApiError } from '../../api/client'
import { loginUser, signupUser } from '../../api/auth'
import type { AuthMode, AuthPayload } from '../../types/auth'

export function useAuth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const switchMode = useCallback((next: AuthMode) => {
    setMode(next)
    setError(null)
    setMessage(null)
  }, [])

  const submit = useCallback(
    async (payload: AuthPayload) => {
      setLoading(true)
      setError(null)
      setMessage(null)

      try {
        if (mode === 'login') {
          const user = await loginUser({ email: payload.email })
          setMessage(`Olá, ${user.name}.`)
          return
        }

        const user = await signupUser({
          name: payload.name,
          email: payload.email,
        })
        setMessage(`Conta criada para ${user.name}.`)
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError('Este e-mail já está em uso.')
        } else if (err instanceof ApiError && err.status === 401) {
          setError('E-mail não encontrado.')
        } else {
          setError('Não foi possível concluir. Confira se a API está no ar.')
        }
      } finally {
        setLoading(false)
      }
    },
    [mode],
  )

  return { mode, switchMode, loading, error, message, submit }
}
