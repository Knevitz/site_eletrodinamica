const jwt = require("jsonwebtoken");

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token =
    authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Token não fornecido ou formato inválido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ erro: "Token expirado." });
      } else {
        return res.status(403).json({ erro: "Token inválido." });
      }
    }
    req.usuario = usuario;
    next();
  });
};

// Middleware adicional para garantir acesso apenas a admins
const apenasAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ erro: "Usuário não autenticado." });
  }
  if (req.usuario.tipo !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores." });
  }
  next();
};

module.exports = { autenticarToken, apenasAdmin };
