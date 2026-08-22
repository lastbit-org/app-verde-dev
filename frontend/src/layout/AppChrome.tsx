import type { ReactNode } from 'react'
import { Footer, MenuBar, Sidebar } from '../components'
import { account, menu, shortcuts } from './nav'

type AppChromeProps = {
  children: ReactNode
  withSidebars?: boolean
}

export function AppChrome({ children, withSidebars = true }: AppChromeProps) {
  return (
    <div className="app">
      <MenuBar brand="Verde" items={menu} />

      {withSidebars ? (
        <div className="shell">
          <Sidebar items={shortcuts} />
          <div className="page">{children}</div>
          <Sidebar items={account} side="end" label="Conta" />
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
