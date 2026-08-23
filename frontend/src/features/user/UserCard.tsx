import { Link } from 'react-router-dom'
import { Paragraph, Title } from '../../components'
import { roleLabel } from '../auth/roles'
import type { User } from '../../types/user'

type UserCardProps = {
  user: User
  isDemo: boolean
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function UserCard({ user, isDemo }: UserCardProps) {
  return (
    <div className="panel user-card">
      <div className="user-avatar" aria-hidden="true">
        {initials(user.name)}
      </div>
      <div>
        <Title as="h4">{user.name}</Title>
        <Paragraph variant="muted">{user.email}</Paragraph>
        <p className="user-meta">
          {roleLabel(user.role)} · Conta #{user.id}
        </p>
        {isDemo ? (
          <Paragraph variant="muted">
            Conta de exemplo.{' '}
            <Link to="/login">Entre</Link> para ver a sua.
          </Paragraph>
        ) : null}
      </div>
    </div>
  )
}
