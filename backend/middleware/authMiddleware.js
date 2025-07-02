const jwt = require("jsonwebtoken");

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Token não fornecido ou formato inválido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const mensagem =
        err.name === "TokenExpiredError"
          ? "Token expirado."
          : "Token inválido.";
      return res.status(401).json({ erro: mensagem });
    }

    req.usuario = decoded; // decoded deve conter id e tipo do usuário
    next();
  });
};

const apenasAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores." });
  }
  next();
};

module.exports = { autenticarToken, apenasAdmin };
