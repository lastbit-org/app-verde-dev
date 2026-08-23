import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { loginUser, signupUser } from '../../api/auth'
import type { AuthMode, AuthPayload } from '../../types/auth'
import { safeNextPath } from './roles'
import { useSession } from './SessionProvider'

export function useAuth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { save } = useSession()
  const navigate = useNavigate()
  const [params] = useSearchParams()

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
        const user =
          mode === 'login'
            ? await loginUser({
                email: payload.email,
                password: payload.password,
              })
            : await signupUser({
                name: payload.name,
                email: payload.email,
                password: payload.password,
              })

        save(user)
        setMessage(`Olá, ${user.name}.`)
        navigate(safeNextPath(params.get('next')))
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError('Este e-mail já está em uso.')
        } else if (err instanceof ApiError && err.status === 401) {
          setError('E-mail ou senha inválidos.')
        } else if (err instanceof ApiError && err.status === 429) {
          setError('Muitas tentativas. Espere um minuto e tente de novo.')
        } else if (err instanceof ApiError && err.status === 400) {
          setError('Confira nome, e-mail e senha (mínimo 8 caracteres, com letra e número).')
        } else {
          setError('Não foi possível concluir. Confira se a API está no ar.')
        }
      } finally {
        setLoading(false)
      }
    },
    [mode, navigate, params, save],
  )

  return { mode, switchMode, loading, error, message, submit }
}
