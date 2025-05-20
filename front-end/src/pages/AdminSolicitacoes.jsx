import { useEffect, useState } from 'react';
import api from '../api/client';
import '../styles/AdminSolicitacoes.css';

export default function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [resposta, setResposta] = useState('');
  const [statusEditado, setStatusEditado] = useState({});

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      const res = await api.get('solicitacoes/');
      setSolicitacoes(res.data);
    } catch (err) {
      alert('Erro ao carregar solicitações');
      console.error(err);
    }
  }

  async function salvarResposta(id) {
    try {
      await api.patch(`solicitacoes/${id}/`, { resposta });
      alert('Resposta salva com sucesso');
      setEditandoId(null);
      setResposta('');
      carregarSolicitacoes();
    } catch (err) {
      alert('Erro ao salvar resposta');
      console.error(err.response?.data || err);
    }
  }

  async function atualizarStatus(id) {
    try {
      const novoStatus = statusEditado[id];
      if (!novoStatus) return;
      await api.patch(`solicitacoes/${id}/`, { status: novoStatus });
      alert('Status atualizado com sucesso!');
      carregarSolicitacoes();
    } catch (err) {
      alert('Erro ao atualizar status');
      console.error(err.response?.data || err);
    }
  }

  return (
    <div className="container mt-5">
      <h2>Solicitações de Equipamentos</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Equipamento</th>
            <th>Solicitante</th>
            <th>Descrição</th>
            <th>Resposta</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((sol) => (
            <tr key={sol.id}>
              <td>{sol.equipamento?.nome || '—'}</td>
              <td>{sol.solicitante_nome || '—'}</td>
              <td>{sol.descricao}</td>
              <td>
                {editandoId === sol.id ? (
                  <textarea
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    rows={2}
                    className="form-control"
                  />
                ) : (
                  sol.resposta || 'Sem resposta'
                )}
              </td>
              <td>
                <select
                  className="form-select"
                  value={statusEditado[sol.id] ?? sol.status}
                  onChange={(e) =>
                    setStatusEditado({ ...statusEditado, [sol.id]: e.target.value })
                  }
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Aceito">Aceito</option>
                  <option value="Recusado">Recusado</option>
                </select>

                <div className="mt-1" style={{ fontSize: '0.8rem' }}>
                  <span>Status atual: <strong>{sol.status}</strong></span><br />
                  {statusEditado[sol.id] && statusEditado[sol.id] !== sol.status && (
                    <span>Novo status: <strong>{statusEditado[sol.id]}</strong></span>
                  )}
                </div>

                <button
                  className="btn btn-outline-secondary btn-sm mt-1"
                  onClick={() => atualizarStatus(sol.id)}
                  disabled={
                    !statusEditado[sol.id] || statusEditado[sol.id] === sol.status
                  }
                >
                  Atualizar Status
                </button>
              </td>
              <td>
                {editandoId === sol.id ? (
                  <>
                    <button
                      onClick={() => salvarResposta(sol.id)}
                      className="btn btn-success btn-sm me-2"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditandoId(sol.id);
                      setResposta(sol.resposta || '');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Responder
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
