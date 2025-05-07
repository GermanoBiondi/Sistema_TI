import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.user_id,
          username: decoded.username,
          tipo: decoded.tipo // ✅ ADICIONADO o campo "tipo"
        });
      } catch (e) {
        console.error('Token inválido:', e);
        localStorage.clear();
        setUser(null);
      }
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('token/', { username, password });
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    const decoded = jwtDecode(data.access);
    setUser({
      id: decoded.user_id,
      username: decoded.username,
      tipo: decoded.tipo // ✅ ADICIONADO aqui também
    });
    navigate('/home');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
