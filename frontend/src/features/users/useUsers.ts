import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../../api/users'
import type { User } from '../../types/user'

export function useUsers(enabled = false) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setUsers(await getUsers())
    } catch {
      setUsers([])
      setError('Não foi possível carregar os usuários. Confira se a API está no ar.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    void loadUsers()
  }, [enabled, loadUsers])

  return { users, loading, error, loadUsers }
}
