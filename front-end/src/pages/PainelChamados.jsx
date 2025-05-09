import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PainelChamados = () => {
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tecnicosSelecionados, setTecnicosSelecionados] = useState({});
  const [prioridades, setPrioridades] = useState({});
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchChamados();
    if (user?.tipo === 'admin') {
      fetchUsuarios();
    }
  }, [user]);

  const fetchChamados = async () => {
    const res = await axios.get('http://localhost:8000/api/chamados/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChamados(res.data);
  };

  const fetchUsuarios = async () => {
    const res = await axios.get('http://localhost:8000/api/auth/usuarios/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsuarios(res.data.filter(u => u.tipo === 'tecnico'));
  };

  const atribuirChamado = async (idChamado, idTecnico) => {
    try {
      await axios.patch(`http://localhost:8000/api/chamados/${idChamado}/`, {
        tecnico_responsavel: idTecnico
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChamados();
      alert("Chamado atribuído com sucesso.");
    } catch {
      alert("Erro ao atribuir chamado.");
    }
  };

  const autoAtribuirChamado = async (idChamado) => {
    await atribuirChamado(idChamado, user.id);
  };

  const classificarChamado = async (idChamado, prioridade) => {
    try {
      await axios.patch(`http://localhost:8000/api/chamados/${idChamado}/`, {
        prioridade: prioridade
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChamados();
      alert("Chamado classificado.");
    } catch {
      alert("Erro ao classificar chamado.");
    }
  };

  return (
    <div>
      <h2>Painel de Chamados</h2>
      {chamados.map((chamado) => (
        <div key={chamado.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          <p><strong>{chamado.titulo}</strong></p>
          <p>{chamado.descricao}</p>
          <p>Status: {chamado.status}</p>
          <p>Prioridade: {chamado.prioridade || 'Não classificada'}</p>
          <p>Técnico: {chamado.tecnico_responsavel_nome || 'Não atribuído'}</p>

          {/* TÉCNICO - AUTOATRIBUIR */}
          {user?.tipo === 'tecnico' && !chamado.tecnico_responsavel &&
            <button onClick={() => autoAtribuirChamado(chamado.id)}>
              Me Atribuir
            </button>
          }

          {/* TÉCNICO OU ADMIN - CLASSIFICAR PRIORIDADE */}
          {(user?.tipo === 'tecnico' || user?.tipo === 'admin') &&
            <div style={{ marginTop: 10 }}>
              <select
                value={prioridades[chamado.id] || ''}
                onChange={(e) =>
                  setPrioridades({ ...prioridades, [chamado.id]: e.target.value })
                }
              >
                <option value="">Classificar Prioridade</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
              <button onClick={() =>
                classificarChamado(chamado.id, prioridades[chamado.id])
              }>
                Classificar
              </button>
            </div>
          }

          {/* ADMIN - ATRIBUIR TÉCNICO */}
          {user?.tipo === 'admin' && (
            <div style={{ marginTop: 10 }}>
              <select
                value={tecnicosSelecionados[chamado.id] || ''}
                onChange={(e) =>
                  setTecnicosSelecionados({
                    ...tecnicosSelecionados,
                    [chamado.id]: e.target.value
                  })
                }
              >
                <option value="">Atribuir Técnico</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
              <button onClick={() =>
                atribuirChamado(chamado.id, tecnicosSelecionados[chamado.id])
              }>
                Atribuir
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PainelChamados;
