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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

// ... mantenha suas importações atuais!

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* SUAS ROTAS ATUAIS - NÃO APAGUE! */}
          <Route path="/" element={<SuaPaginaAtual />} />
          
          {/* ADICIONE ESTAS ROTAS DO ADMIN */}
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;