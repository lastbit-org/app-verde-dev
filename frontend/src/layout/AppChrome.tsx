import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer, MenuBar, Sidebar } from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { accountFor, menuFor, shortcutsFor } from './nav'

type AppChromeProps = {
  children: ReactNode
  withSidebars?: boolean
}

export function AppChrome({ children, withSidebars = true }: AppChromeProps) {
  const { user, clear } = useSession()
  const navigate = useNavigate()

  async function logout() {
    await clear()
    navigate('/login')
  }

  return (
    <div className="app">
      <MenuBar brand="Verde" items={menuFor(user)} onLogout={() => void logout()} />

      {withSidebars ? (
        <div className="shell">
          <Sidebar items={shortcutsFor(user)} />
          <div className="page">{children}</div>
          <Sidebar
            items={accountFor(user)}
            side="end"
            label="Conta"
            onLogout={() => void logout()}
          />
        </div>
      ) : (
        <div className="page page-auth">{children}</div>
      )}
    </div>
  )
}

export function PageFooter() {
  return <Footer>Verde · entrega inicial</Footer>
}
