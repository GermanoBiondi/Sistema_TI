import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import ChamadoForm from './pages/ChamadoForm';
import PainelChamados from './pages/PainelChamados';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/chamado"
            element={
              <PrivateRoute>
                <ChamadoForm />
              </PrivateRoute>
            }
          />
          <Route path="/painel-chamados" 
          element={
            <PainelChamados 
              />} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
