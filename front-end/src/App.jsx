import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import ChamadoForm from './pages/ChamadoForm';
import PainelChamados from './pages/PainelChamados';
import HistoricoChamados from './pages/HistoricoChamados'; // ✅ novo
import CadastroEquipamento from './pages/CadastroEquipamento';
import SolicitacaoEquipamento from './pages/SolicitacaoEquipamento';
import AdminSolicitacoes from './pages/AdminSolicitacoes';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
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
          <Route 
            path="/painel-chamados" 
            element={
              <PrivateRoute>
                <PainelChamados />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/historico" 
            element={
              <PrivateRoute>
                <HistoricoChamados />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/cadastro-equipamento" 
            element={
              <PrivateRoute>
                <CadastroEquipamento />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/solicitacao-equipamento" 
            element={
              <PrivateRoute>
                <SolicitacaoEquipamento />
              </PrivateRoute>
            } 
          />
          <Route path="/admin/solicitacoes" element={
            <PrivateRoute adminOnly>
              <AdminSolicitacoes />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
