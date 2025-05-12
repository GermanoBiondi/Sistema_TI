import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/chamados/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
        .then(res => res.json())
        .then(data => setChamados(data))
        .catch(console.error);
    }
  }, [user]);

  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 home-card shadow">
        <h1 className="mb-4 text-center">Painel Principal</h1>

        <nav className="mb-4 text-center d-flex flex-wrap justify-content-center gap-2">
          <Link to="/chamado" className="btn btn-primary">Criar Chamado</Link>
          <Link to="/painel-chamados" className="btn btn-secondary">Painel de Chamados</Link>

          {/* Botão visível apenas para ADMIN */}
          {user?.tipo === 'admin' && (
            <Link to="/cadastro-equipamento" className="btn btn-outline-success">
              Cadastrar Equipamento
            </Link>
          )}

          {/* Botão visível apenas para USUÁRIO COMUM */}
          {user?.tipo === 'usuario' && (
            <Link to="/solicitacao-equipamento" className="btn btn-outline-info">
              Solicitar Equipamento
            </Link>
          )}
        </nav>

        <h2 className="mb-3">Seus Chamados</h2>
        <ul className="list-group">
          {chamados.map(c => (
            <li key={c.id} className="list-group-item">{c.titulo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
