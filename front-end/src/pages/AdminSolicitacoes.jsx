import { useEffect, useState } from 'react';
import api from '../api/client';
import '../styles/AdminSolicitacoes.css';

export default function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        const res = await api.get('solicitacoes/');
        setSolicitacoes(res.data);
      } catch (err) {
        alert('Erro ao carregar solicitações');
        console.error(err);
      }
    }
    carregarSolicitacoes();
  }, []);

  async function salvarResposta(id) {
    try {
      console.log('Enviando PATCH para:', `solicitacoes/${id}/`, { resposta });

      await api.patch(`solicitacoes/${id}/`, { resposta });
      alert('Resposta salva com sucesso');
      setEditandoId(null);
      setResposta('');
      const res = await api.get('solicitacoes/');
      setSolicitacoes(res.data);
    } catch (err) {
      alert('Erro ao salvar resposta');
      console.error(err.response?.data || err);
    }
  }

  return (
    <div className="container mt-5">
      <h2>Solicitações de Equipamentos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Equipamento</th>
            <th>Solicitante</th>
            <th>Descrição</th>
            <th>Resposta</th>
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
                    rows={3}
                  />
                ) : (
                  sol.resposta || 'Sem resposta'
                )}
              </td>
              <td>
                {editandoId === sol.id ? (
                  <>
                    <button onClick={() => salvarResposta(sol.id)} className="btn btn-success me-2">Salvar</button>
                    <button onClick={() => setEditandoId(null)} className="btn btn-secondary">Cancelar</button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditandoId(sol.id);
                      setResposta(sol.resposta || '');
                    }}
                    className="btn btn-primary"
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
