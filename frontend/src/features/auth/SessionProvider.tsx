import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMe, logoutUser } from '../../api/auth'
import type { User } from '../../types/user'
import { forgetLegacySession } from './session'

type SessionValue = {
  user: User | null
  loading: boolean
  save: (user: User) => void
  clear: () => Promise<void>
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    forgetLegacySession()
    let cancelled = false

    void getMe()
      .then((next) => {
        if (!cancelled) {
          setUser(next)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
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
  }, [])

  const save = useCallback((next: User) => {
    setUser(next)
  }, [])

  const clear = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Cookie may already be gone.
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, save, clear }),
    [user, loading, save, clear],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }

  return context
}
