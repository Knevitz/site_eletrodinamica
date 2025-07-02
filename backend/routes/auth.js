const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  autenticarToken,
  apenasAdmin,
} = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimit");

// Rotas com rate limiting para evitar brute force
router.post("/registrar", authLimiter, authController.registrar);
router.post("/login", authLimiter, authController.login);
router.post("/recuperar-senha", authLimiter, authController.recuperarSenha);
router.post("/redefinir-senha", authLimiter, authController.redefinirSenha);

// Rotas protegidas
router.get("/verificar-token", authController.verificarToken);
router.get("/protegido", autenticarToken, authController.protegido);

// Rota exclusiva para admin
router.get("/admin", autenticarToken, apenasAdmin, (req, res) => {
  res.status(200).json({ mensagem: "Bem-vindo, administrador!" });
});

module.exports = router;
