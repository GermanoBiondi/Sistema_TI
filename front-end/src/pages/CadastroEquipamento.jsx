import { useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function CadastroEquipamento() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [equipamentos, setEquipamentos] = useState([]); // Estado para armazenar os equipamentos cadastrados
  const navigate = useNavigate();

  useEffect(() => {
    // Função para carregar os equipamentos cadastrados
    const fetchEquipamentos = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          alert('Você precisa estar logado para visualizar os equipamentos.');
          return;
        }

        const response = await api.get('equipamentos/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEquipamentos(response.data); // Atualiza o estado com os equipamentos
      } catch (err) {
        console.error('Erro ao carregar os equipamentos:', err);
        alert('Erro ao carregar os equipamentos.');
      }
    };

    fetchEquipamentos(); // Carregar os equipamentos ao carregar o componente
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Você precisa estar logado para cadastrar um equipamento.');
        return;
      }

      // Envia os dados do novo equipamento para a API
      await api.post('equipamentos/', { nome, descricao }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Equipamento cadastrado com sucesso!');
      setNome(''); // Limpa o campo do nome
      setDescricao(''); // Limpa o campo de descrição

      // Recarrega a lista de equipamentos
      const response = await api.get('equipamentos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEquipamentos(response.data); // Atualiza a lista de equipamentos

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

      {/* Lista de Equipamentos Cadastrados */}
      <div className="mt-5">
        <h3>Equipamentos Cadastrados</h3>
        {equipamentos.length === 0 ? (
          <p className="text-center">Nenhum equipamento cadastrado.</p>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Descrição</th>
                <th scope="col">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((equipamento) => (
                <tr key={equipamento.id}>
                  <td>{equipamento.nome}</td>
                  <td>{equipamento.descricao}</td>
                  <td>{new Date(equipamento.data_cadastro).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
