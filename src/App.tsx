import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Admin route - hidden from navigation, accessible directly via /admin */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}