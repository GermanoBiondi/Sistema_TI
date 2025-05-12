// src/pages/ChamadoForm.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/ChamadoForm.css';

export default function ChamadoForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/chamados/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({ titulo, descricao }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erro ao criar chamado:', errorData); // Adicione isso
        throw new Error('Erro ao criar chamado');
      }
      navigate('/home');
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="chamado-form-container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 chamado-form-card shadow">
        <h1 className="mb-4 text-center">Novo Chamado</h1>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título:</label>
            <input
              type="text"
              className="form-control"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descrição:</label>
            <textarea
              className="form-control"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Criar Chamado</button>
        </form>
      </div>
    </div>
  );
}
