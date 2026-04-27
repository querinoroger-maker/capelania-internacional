// Importe suas páginas atuais aqui
// import HomePage from './pages/HomePage';

// Importe o admin
import AdminPage from './pages/AdminPage';

function App() {
  // Verifica se está na rota /admin
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminPage />;
  }

  // Sua página principal normal
  return (
    <div>
      {/* Substitua por sua página principal */}
      <h1>🏠 Home Page</h1>
      <a href="/admin" style={{ color: '#2563eb' }}>Go to Admin →</a>
    </div>
  );
}

export default App;