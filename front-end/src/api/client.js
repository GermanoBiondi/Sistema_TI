import axios from 'axios';

const client = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Adiciona o token JWT automaticamente
client.interceptors.request.use((config) => {
  console.log('Interceptado [POST]:', config.url);
  const token = localStorage.getItem("access"); // << corrigido aqui
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros de autenticação
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access"); // também corrigido aqui
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
