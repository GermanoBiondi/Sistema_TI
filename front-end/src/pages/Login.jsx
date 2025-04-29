// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Usuário" value={username}
             onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" value={password}
             onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}
