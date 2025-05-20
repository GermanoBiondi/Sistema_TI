// src/pages/HistoricoChamados.jsx
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default function HistoricoChamados() {
  const { user } = useContext(AuthContext);
  const [chamadosEncerrados, setChamadosEncerrados] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/chamados/?status=encerrado', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
        .then(res => res.json())
        .then(data => setChamadosEncerrados(data))
        .catch(console.error);
    }
  }, [user]);

  function formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  return (
    <div className="container mt-5">
      <h2>Histórico de Chamados Encerrados</h2>
      {chamadosEncerrados.length === 0 ? (
        <p>Nenhum chamado encerrado encontrado.</p>
      ) : (
        <ul className="list-group">
          {chamadosEncerrados.map(chamado => (
            <li key={chamado.id} className="list-group-item">
              <strong>{chamado.titulo}</strong>
              <br />
              <small>Status: {chamado.status}</small>
              <br />
              <small>Data de Criação: {formatDate(chamado.data_criacao)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
