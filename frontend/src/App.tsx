import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { StorePage } from './pages/StorePage'
import { UserPage } from './pages/UserPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  )
}

export default App
