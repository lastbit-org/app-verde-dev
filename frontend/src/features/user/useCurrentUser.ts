import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../api/client'
import { getUser, updateUser } from '../../api/users'
import type { UpdateUserInput, User } from '../../types/user'
import { useSession } from '../auth/SessionProvider'

export function useCurrentUser() {
  const session = useSession()
  const [fallback, setFallback] = useState<User | null>(null)
  const [loading, setLoading] = useState(!session.user)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (session.user) {
      setFallback(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)

    void getUser(1)
      .then((user) => {
        if (!cancelled) {
          setFallback(user)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFallback(null)
          setError(
            'Não foi possível carregar o usuário. Confira se a API está no ar.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [session.user])

  const user = session.user ?? fallback

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
        if (session.user) {
          session.save(next)
        } else {
          setFallback(next)
        }
        setMessage('Dados pessoais atualizados.')
        return true
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError('E-mail ou CPF já está em uso.')
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

  const clear = useCallback(() => {
    session.clear()
  }, [session])

  return {
    user,
    isDemo: !session.user && fallback !== null,
    loading,
    saving,
    error,
    message,
    updateProfile,
    clear,
  }
}
