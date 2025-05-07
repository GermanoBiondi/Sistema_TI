import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PainelAdmin = () => {
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState({});
  const [usuarios, setUsuarios] = useState([]);

  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchChamados();
    fetchUsuarios();
  }, []);

  const fetchChamados = async () => {
    const response = await axios.get('http://localhost:8000/api/chamados/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChamados(response.data);
  };

  const fetchUsuarios = async () => {
    const response = await axios.get('http://localhost:8000/api/auth/usuarios/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsuarios(response.data.filter(u => u.tipo === 'tecnico')); // supondo que tipo = tecnico
  };

  const atribuirChamado = async (chamadoId) => {
    const tecnicoId = tecnicos[chamadoId];
    if (!tecnicoId) return alert('Selecione um técnico');

    try {
      await axios.patch(
        `http://localhost:8000/api/chamados/${chamadoId}/`,
        { tecnico: tecnicoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChamados();
      alert('Chamado atribuído com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao atribuir chamado.');
    }
  };

  return (
    <div>
      <h2>Painel do Administrador</h2>
      {chamados.map((chamado) => (
        <div key={chamado.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          <p><strong>Título:</strong> {chamado.titulo}</p>
          <p><strong>Descrição:</strong> {chamado.descricao}</p>
          <p><strong>Status:</strong> {chamado.status}</p>
          <p><strong>Gravidade:</strong> {chamado.gravidade}</p>
          <p><strong>Técnico:</strong> {chamado.tecnico_nome || 'Não atribuído'}</p>

          <select
            value={tecnicos[chamado.id] || ''}
            onChange={(e) => setTecnicos({ ...tecnicos, [chamado.id]: e.target.value })}
          >
            <option value="">Selecione um técnico</option>
            {usuarios.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <button onClick={() => atribuirChamado(chamado.id)}>Atribuir</button>
        </div>
      ))}
    </div>
  );
};

export default PainelAdmin;
