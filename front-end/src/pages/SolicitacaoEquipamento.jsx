import { useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function SolicitacaoEquipamento() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregarEquipamentos = async () => {
      try {
        const response = await api.get('equipamentos/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });

        console.log('Equipamentos recebidos:', response.data); // 👈 verificação
        setEquipamentos(response.data);
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        alert(
          'Erro ao carregar equipamentos: ' +
            (error.response?.data?.detail || error.message)
        );
      }
    };

    carregarEquipamentos();
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
          equipamento: equipamentoSelecionado,
          descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );

      alert('Solicitação enviada com sucesso!');
      navigate('/home');
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
    </div>
  );
}
