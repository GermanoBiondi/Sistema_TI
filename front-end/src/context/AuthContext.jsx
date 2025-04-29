// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) setUser({}); 
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('token/', { username, password });
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    setUser({ username });
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
