import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { StorePage } from './pages/StorePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
