import { useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function SolicitacaoEquipamento() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
  const navigate = useNavigate();

  const carregarEquipamentosESolicitacoes = async () => {
    try {
      const token = localStorage.getItem('access');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Carregar solicitações do usuário
      const solicitacoesRes = await api.get('solicitacoes/', { headers });
      const solicitacoes = solicitacoesRes.data;
      setMinhasSolicitacoes(solicitacoes);

      // 2. Obter os IDs dos equipamentos já solicitados
      const idsSolicitados = solicitacoes.map((s) => s.equipamento?.id);

      // 3. Carregar equipamentos
      const equipamentosRes = await api.get('equipamentos/', { headers });
      const equipamentosDisponiveis = equipamentosRes.data.filter(
        (equip) => !idsSolicitados.includes(equip.id)
      );

      setEquipamentos(equipamentosDisponiveis);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert(
        'Erro ao carregar equipamentos: ' +
        (error.response?.data?.detail || error.message)
      );
    }
  };

  useEffect(() => {
    carregarEquipamentosESolicitacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!equipamentoSelecionado) {
      alert('Por favor, selecione um equipamento.');
      return;
    }

    try {
      await api.post(
        'solicitacoes/',
        {
          equipamento_id: equipamentoSelecionado,
          descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );

      alert('Solicitação enviada com sucesso!');
      setDescricao('');
      setEquipamentoSelecionado('');
      await carregarEquipamentosESolicitacoes(); // Atualiza lista
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      alert('Erro ao enviar solicitação: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Solicitar Equipamento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="equipamento" className="form-label">Escolha o Equipamento</label>
          <select
            className="form-control"
            id="equipamento"
            value={equipamentoSelecionado}
            onChange={(e) => setEquipamentoSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um equipamento</option>
            {equipamentos.map((equipamento) =>
              equipamento?.id && equipamento?.nome ? (
                <option key={equipamento.id} value={equipamento.id}>
                  {equipamento.nome}
                </option>
              ) : null
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">Descrição (opcional)</label>
          <textarea
            className="form-control"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Enviar Solicitação</button>
      </form>

      {/* Tabela de solicitações já feitas */}
      <div className="mt-5">
        <h4>Minhas Solicitações</h4>
        {minhasSolicitacoes.length === 0 ? (
          <p>Você ainda não fez nenhuma solicitação.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Equipamento</th>
                <th>Descrição</th>
                <th>Resposta</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {minhasSolicitacoes.map((s) => (
                <tr key={s.id}>
                  <td>{s.equipamento?.nome || '—'}</td>
                  <td>{s.descricao}</td>
                  <td>{s.resposta || 'Aguardando resposta'}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
