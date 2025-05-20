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
        .then(data => {
          // Filtra para remover chamados encerrados
          const chamadosAtivos = data.filter(chamado => chamado.status !== 'encerrado');
          setChamados(chamadosAtivos);
        })
        .catch(console.error);
    }
  }, [user]);

  function formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Data inválida'
      : date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }

  async function encerrarChamado(id) {
    if (!window.confirm('Deseja realmente encerrar este chamado?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/chamados/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({ status: 'encerrado' }),
      });

      if (!response.ok) throw new Error('Erro ao encerrar chamado');

      setChamados(prev => prev.filter(chamado => chamado.id !== id));
      alert('Chamado encerrado com sucesso.');
    } catch (error) {
      alert('Falha ao encerrar o chamado. Tente novamente.');
      console.error(error);
    }
  }

  // Verifica se o usuário pode encerrar (admin ou tecnico)
  const podeEncerrar = user?.tipo === 'admin' || user?.tipo === 'tecnico';

  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 home-card shadow">
        <h1 className="mb-4 text-center">Sistema Chamado T.I</h1>

        <nav className="mb-4 text-center d-flex flex-wrap justify-content-center gap-2">
          <Link to="/chamado" className="btn btn-primary">Criar Chamado</Link>
          <Link to="/painel-chamados" className="btn btn-secondary">Chamados</Link>
          <Link to="/historico" className="btn btn-info">Histórico</Link>

          {user?.tipo === 'admin' && (
            <>
              <Link to="/cadastro-equipamento" className="btn btn-outline-success">
                Cadastrar Equipamento
              </Link>
              <Link to="/admin/solicitacoes" className="btn btn-outline-warning">
                Ver Solicitações
              </Link>
            </>
          )}

          {user?.tipo === 'usuario' && (
            <Link to="/solicitacao-equipamento" className="btn btn-outline-info">
              Solicitar Equipamento
            </Link>
          )}
        </nav>

        <h2 className="mb-3">Seus Chamados</h2>
        <ul className="list-group">
          {chamados.length === 0 ? (
            <li className="list-group-item">Nenhum chamado em aberto.</li>
          ) : (
            chamados.map(c => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{c.titulo}</strong>
                  <br />
                  <small>Status: {c.status}</small>
                  <br />
                  <small>Aberto em: {formatDate(c.data_criacao)}</small>
                </div>

                {/* Só mostra o botão para admin e tecnico */}
                {podeEncerrar && (
                  <button
                    onClick={() => encerrarChamado(c.id)}
                    className="btn btn-sm btn-danger"
                    title="Encerrar chamado"
                  >
                    Encerrar
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
