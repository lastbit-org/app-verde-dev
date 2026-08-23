import { useCallback, useState } from 'react'
import { ApiError } from '../../api/client'
import { changePassword } from '../../api/auth'
import { updateUser } from '../../api/users'
import type { UpdateUserInput } from '../../types/user'
import { useSession } from '../auth/SessionProvider'

export function useCurrentUser() {
  const session = useSession()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const user = session.user

  const updateProfile = useCallback(
    async (payload: UpdateUserInput) => {
      if (!user) {
        return false
      }

      setSaving(true)
      setError(null)
      setMessage(null)

      try {
        const next = await updateUser(user.id, payload)
        session.save(next)
        setMessage('Dados pessoais atualizados.')
        return true
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError('E-mail ou CPF já está em uso.')
        } else if (err instanceof ApiError && err.status === 401) {
          setError('Sessão expirada. Entre novamente.')
        } else if (err instanceof ApiError && err.status === 400) {
          setError('Confira nome, e-mail e CPF (11 dígitos).')
        } else {
          setError('Não foi possível salvar. Confira se a API está no ar.')
        }
        return false
      } finally {
        setSaving(false)
      }
    },
    [session, user],
  )

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setSaving(true)
      setError(null)
      setMessage(null)

      try {
        await changePassword({ currentPassword, newPassword })
        setMessage('Senha atualizada.')
        return true
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError('Senha atual incorreta.')
        } else if (err instanceof ApiError && err.status === 400) {
          setError('A nova senha precisa ter entre 6 e 72 caracteres.')
        } else {
          setError('Não foi possível atualizar a senha.')
        }
        return false
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const clear = useCallback(async () => {
    await session.clear()
  }, [session])

  return {
    user,
    loading: session.loading,
    saving,
    error,
    message,
    updateProfile,
    updatePassword,
    clear,
  }
}
