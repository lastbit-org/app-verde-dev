import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '../../types/user'
import { clearSession, readSession, writeSession } from './session'

type SessionValue = {
  user: User | null
  save: (user: User) => void
  clear: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readSession())

  const save = useCallback((next: User) => {
    writeSession(next)
    setUser(next)
  }, [])

  const clear = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, save, clear }), [user, save, clear])

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
