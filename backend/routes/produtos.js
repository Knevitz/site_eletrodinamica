const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const autenticarToken = authMiddleware.autenticarToken;
const apenasAdmin = authMiddleware.apenasAdmin;

// Rotas protegidas (somente admin)
router.post(
  "/",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.criarProduto
);

// Atualizar produto
router.patch(
  "/:id",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.atualizarProduto
);

// Excluir produto
router.delete(
  "/:id",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  produtoController.excluirProduto
);

// listar produtos ativos
router.get("/ativos", produtoController.listarProdutosAtivos);
router.get(
  "/:id",
  autenticarToken,
  apenasAdmin,
  produtoController.buscarProdutoPorId
);
router.get(
  "/",
  autenticarToken,
  apenasAdmin,
  produtoController.listarTodosProdutos
);
router.get(
  "/admin",
  authMiddleware.autenticarToken,
  authMiddleware.apenasAdmin,
  produtoController.listarTodosProdutos
);

module.exports = router;
