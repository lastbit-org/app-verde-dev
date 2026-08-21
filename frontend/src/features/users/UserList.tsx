import type { User } from '../../types/user'

type UserListProps = {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return null
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  )
}
