import { HomeStore } from '../features/store/HomeStore'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function StorePage() {
  return (
    <AppChrome>
      <main>
        <HomeStore />
      </main>

      <PageFooter />
    </AppChrome>
  )
}
