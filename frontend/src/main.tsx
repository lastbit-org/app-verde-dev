import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './features/auth/SessionProvider'
import { CartProvider } from './features/cart/CartProvider'
import { FavoritesProvider } from './features/favorites/FavoritesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <FavoritesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FavoritesProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
