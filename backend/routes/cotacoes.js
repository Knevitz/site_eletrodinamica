const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middleware/authMiddleware");
const cotacaoController = require("../controllers/cotacaoController");

// Cliente envia uma cotação
router.post("/", autenticarToken, cotacaoController.enviarCotacao);

// Cliente vê suas próprias cotações
router.get("/minhas", autenticarToken, cotacaoController.getMinhasCotacoes);
// backend/routes/cotacoes.js

module.exports = router;
