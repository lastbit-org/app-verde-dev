import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { PaymentPage } from './pages/PaymentPage'
import { ProductPage } from './pages/ProductPage'
import { ProductsTablePage } from './pages/ProductsTablePage'
import { PurchasesPage } from './pages/PurchasesPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'
import { StorePage } from './pages/StorePage'
import { UserPage } from './pages/UserPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/products" element={<ProductsTablePage />} />
      <Route path="/purchases" element={<PurchasesPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/checkout" element={<PaymentPage />} />
    </Routes>
  )
}

export default App
