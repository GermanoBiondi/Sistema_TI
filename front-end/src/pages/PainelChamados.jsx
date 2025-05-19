// src/pages/PainelChamados.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/PainelChamados.css';

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
    const res = await axios.get('http://localhost:8000/api/auth/tecnicos/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsuarios(res.data);
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

  // Nova função para excluir chamado
  const excluirChamado = async (idChamado) => {
    if (!window.confirm("Tem certeza que deseja excluir este chamado?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/chamados/${idChamado}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChamados();
      alert("Chamado excluído com sucesso.");
    } catch {
      alert("Erro ao excluir chamado.");
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Painel de Chamados</h2>
      {chamados.map((chamado) => (
        <div key={chamado.id} className="card mb-3 p-3">
          <div className="card-body">
            <h5 className="card-title">{chamado.titulo}</h5>
            <p className="card-text">{chamado.descricao}</p>
            <p>Status: {chamado.status}</p>
            <p>Prioridade: {chamado.prioridade || 'Não classificada'}</p>
            <p>Técnico: {chamado.tecnico_responsavel_nome || 'Não atribuído'}</p>

            {/* TÉCNICO - AUTOATRIBUIR */}
            {user?.tipo === 'tecnico' && !chamado.tecnico_responsavel &&
              <button onClick={() => autoAtribuirChamado(chamado.id)} className="btn btn-info me-2">
                Me Atribuir
              </button>
            }

            {/* TÉCNICO OU ADMIN - CLASSIFICAR PRIORIDADE */}
            {(user?.tipo === 'tecnico' || user?.tipo === 'admin') &&
              <div className="mt-3">
                <select
                  value={prioridades[chamado.id] || ''}
                  onChange={(e) => setPrioridades({ ...prioridades, [chamado.id]: e.target.value })}
                  className="form-select"
                >
                  <option value="">Classificar Prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
                <button onClick={() => classificarChamado(chamado.id, prioridades[chamado.id])} className="btn btn-primary mt-2">
                  Classificar
                </button>
              </div>
            }

            {/* ADMIN - ATRIBUIR TÉCNICO */}
            {user?.tipo === 'admin' && (
              <div className="mt-3">
                <select
                  value={tecnicosSelecionados[chamado.id] || ''}
                  onChange={(e) =>
                    setTecnicosSelecionados({
                      ...tecnicosSelecionados,
                      [chamado.id]: e.target.value
                    })
                  }
                  className="form-select"
                >
                  <option value="">Atribuir Técnico</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <button onClick={() =>
                  atribuirChamado(chamado.id, tecnicosSelecionados[chamado.id])
                } className="btn btn-success mt-2 me-2">
                  Atribuir
                </button>

                {/* Botão de excluir para admin */}
                <button onClick={() => excluirChamado(chamado.id)} className="btn btn-danger mt-2">
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PainelChamados;
