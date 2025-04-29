import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/chamados/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
        .then(res => res.json())
        .then(data => setChamados(data))
        .catch(console.error);
    }
  }, [user]);

  return (
    <div>
      <h1>Painel Principal</h1>
      <Link to="/chamado">Criar Chamado</Link> {/* Link adicionado aqui */}

      <h2>Chamados:</h2>
      <ul>
        {chamados.map(c => (
          <li key={c.id}>{c.titulo}</li>
        ))}
      </ul>
    </div>
  );
}
