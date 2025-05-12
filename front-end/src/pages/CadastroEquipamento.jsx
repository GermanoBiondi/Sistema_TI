import { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function CadastroEquipamento() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verifica se o admin está logado
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Você precisa estar logado para cadastrar um equipamento.');
        return;
      }

      await api.post('equipamentos/', { nome, descricao }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Equipamento cadastrado com sucesso!');
      navigate('/home'); // Voltar para a página inicial ou painel
    } catch (err) {
      console.error('Erro ao cadastrar equipamento:', err);
      alert('Erro ao cadastrar equipamento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cadastrar Novo Equipamento</h2>
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

        <button type="submit" className="btn btn-primary">Cadastrar Equipamento</button>
      </form>
    </div>
  );
}
