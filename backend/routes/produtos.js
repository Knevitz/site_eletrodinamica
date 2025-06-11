const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Rotas protegidas (somente admin)
router.post(
  "/",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.criarProduto
);
router.put(
  "/:id",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.atualizarProduto
);
router.delete(
  "/:id",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  produtoController.excluirProduto
);

// Rota pública (listar produtos ativos)
router.get("/", produtoController.listarProdutosAtivos);

module.exports = router;
