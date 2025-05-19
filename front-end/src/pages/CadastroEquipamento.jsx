import { useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function CadastroEquipamento() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [equipamentos, setEquipamentos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await api.get('equipamentos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEquipamentos(response.data);
    } catch (err) {
      alert('Erro ao carregar equipamentos: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Você precisa estar logado.');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`equipamentos/${editandoId}/`, { nome, descricao }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Equipamento atualizado com sucesso!');
        setEditandoId(null);
      } else {
        await api.post('equipamentos/', { nome, descricao }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Equipamento cadastrado com sucesso!');
      }

      setNome('');
      setDescricao('');
      carregarEquipamentos();

    } catch (err) {
      console.error('Erro ao salvar equipamento:', err.response?.data || err);
      alert('Erro ao salvar equipamento.');
    }
  };

  const handleEditar = (equipamento) => {
    setEditandoId(equipamento.id);
    setNome(equipamento.nome);
    setDescricao(equipamento.descricao);
  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;

    try {
      await api.delete(`equipamentos/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      alert('Equipamento excluído com sucesso.');
      carregarEquipamentos();
    } catch (err) {
      console.error('Erro ao excluir equipamento:', err.response?.data || err);
      alert('Erro ao excluir equipamento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{editandoId ? 'Editar Equipamento' : 'Cadastrar Novo Equipamento'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome do Equipamento</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <textarea
            className="form-control"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editandoId ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editandoId && (
          <button type="button" className="btn btn-secondary ms-2" onClick={() => {
            setEditandoId(null);
            setNome('');
            setDescricao('');
          }}>
            Cancelar
          </button>
        )}
      </form>

      <div className="mt-5">
        <h3>Equipamentos Cadastrados</h3>
        {equipamentos.length === 0 ? (
          <p className="text-center">Nenhum equipamento cadastrado.</p>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data de Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((equipamento) => (
                <tr key={equipamento.id}>
                  <td>{equipamento.nome}</td>
                  <td>{equipamento.descricao}</td>
                  <td>{new Date(equipamento.data_cadastro).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditar(equipamento)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleExcluir(equipamento.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
