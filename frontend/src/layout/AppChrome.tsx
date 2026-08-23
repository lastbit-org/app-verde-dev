import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomBar, Footer, MenuBar, Sidebar } from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { adminNavFor, clientNavFor, storeNav } from './nav'

type AppChromeProps = {
  children: ReactNode
  withSidebars?: boolean
}

export function AppChrome({ children, withSidebars = true }: AppChromeProps) {
  const { user, clear } = useSession()
  const navigate = useNavigate()
  const adminItems = adminNavFor(user)
  const hasAdminBar = adminItems.length > 0

  async function logout() {
    await clear()
    navigate('/login')
  }

  return (
    <div className={`app${hasAdminBar ? ' app-admin' : ''}`}>
      <MenuBar brand="Verde" />

      {withSidebars ? (
        <div className="shell">
          <Sidebar items={storeNav} label="Loja" />
          <div className="page">{children}</div>
          <Sidebar
            items={clientNavFor(user)}
            side="end"
            label="Conta"
            onLogout={() => void logout()}
          />
        </div>
      ) : (
        <div className="page page-auth">{children}</div>
      )}

      {hasAdminBar ? <BottomBar items={adminItems} /> : null}
    </div>
  )
}

export function PageFooter() {
  return <Footer>Verde · entrega inicial</Footer>
}
