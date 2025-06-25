import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Não está logado → redireciona para login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (!allowedRoles.includes(decoded.tipo)) {
      // Está logado, mas não tem permissão para essa rota
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Token inválido (mal formado ou expirado)
    return <Navigate to="/login" replace />;
  }

  // Tudo certo → renderiza os componentes filhos da rota protegida
  return <Outlet />;
};

export default PrivateRoute;
