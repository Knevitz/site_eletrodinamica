import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Não está logado, redireciona para login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (!allowedRoles.includes(decoded.tipo)) {
      // Usuário não tem permissão para essa rota
      return <Navigate to="/" replace />; // Redireciona para home, por exemplo
    }
  } catch (error) {
    // Token inválido
    return <Navigate to="/login" replace />;
  }

  // Se tudo certo, renderiza os componentes filhos (rotas protegidas)
  return <Outlet />;
};

export default PrivateRoute;
