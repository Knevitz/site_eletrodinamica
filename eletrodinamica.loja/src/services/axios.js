import axios from "axios";

// Cria uma instância do axios com configuração básica segura
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // url da sua API (ex: http://localhost:3000/api)
  timeout: 15000, // 15 segundos de timeout, para evitar requests pendentes eternamente
  withCredentials: true, // se sua API usar cookies para autenticação, configure aqui
});

// Interceptor para adicionar token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Busque o token armazenado no localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Rejeita erros na requisição
);

// Interceptor para lidar com respostas de erro, principalmente 401 Unauthorized
api.interceptors.response.use(
  (response) => response, // Repassa resposta normalmente
  (error) => {
    if (error.response) {
      // Se o status for 401 significa token inválido ou expirado
      if (error.response.status === 401) {
        // Remova token e dados sensíveis para logout seguro
        localStorage.removeItem("token");
        localStorage.removeItem("usuario"); // se armazenar dados do usuário

        // Redirecionamento seguro para login
        // Se estiver usando react-router v6+, é melhor emitir evento global ou usar um hook.
        // Aqui, apenas um fallback simples:
        window.location.href = "/login";

        // Você pode disparar evento global para componentes ouvirem e reagirem ao logout
      }
    }
    return Promise.reject(error);
  }
);

export default api;
