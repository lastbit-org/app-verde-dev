import { useCallback, useEffect, useState } from 'react'
import { getUser } from '../../api/users'
import type { User } from '../../types/user'
import { useSession } from '../auth/SessionProvider'

export function useCurrentUser() {
  const session = useSession()
  const [fallback, setFallback] = useState<User | null>(null)
  const [loading, setLoading] = useState(!session.user)
  const [error, setError] = useState<string | null>(null)

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
          setError('Não foi possível carregar o usuário. Confira se a API está no ar.')
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

  const clear = useCallback(() => {
    session.clear()
  }, [session])

  return {
    user: session.user ?? fallback,
    isDemo: !session.user && fallback !== null,
    loading,
    error,
    clear,
  }
}
