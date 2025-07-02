const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 requisições por IP
  message: { erro: "Muitas tentativas, tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
