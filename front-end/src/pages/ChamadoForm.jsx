// src/pages/ChamadoForm.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    <div>
      <h1>Novo Chamado</h1>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required />
        </div>
        <button type="submit">Criar Chamado</button>
      </form>
    </div>
  );
}
