import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './features/auth/RequireAuth'
import { FavoritesPage } from './pages/FavoritesPage'
import { LoginPage } from './pages/LoginPage'
import { PaymentPage } from './pages/PaymentPage'
import { ProductPage } from './pages/ProductPage'
import { ProductsTablePage } from './pages/ProductsTablePage'
import { ProductEditorPage } from './pages/ProductEditorPage'
import { OrderConfirmPage } from './pages/OrderConfirmPage'
import { PurchasesPage } from './pages/PurchasesPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'
import { StorePage } from './pages/StorePage'
import { UserPage } from './pages/UserPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/user"
        element={
          <RequireAuth>
            <UserPage />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth roles={['admin', 'partner']}>
            <ProductsTablePage />
          </RequireAuth>
        }
      />
      <Route
        path="/products/new"
        element={
          <RequireAuth roles={['admin', 'partner']}>
            <ProductEditorPage />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <RequireAuth roles={['admin', 'partner']}>
            <ProductEditorPage />
          </RequireAuth>
        }
      />
      <Route
        path="/purchases"
        element={
          <RequireAuth>
            <PurchasesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/favorites"
        element={
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        }
      />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <PaymentPage />
          </RequireAuth>
        }
      />
      <Route
        path="/checkout/confirm"
        element={
          <RequireAuth>
            <OrderConfirmPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
