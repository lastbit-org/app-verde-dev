import type { User } from '../../types/user'
import { roleLabel } from '../auth/roles'

type UserListProps = {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return null
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Papel</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{roleLabel(user.role)}</td>
              <td>
                {user.address
                  ? `${user.address.city}/${user.address.uf}`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
