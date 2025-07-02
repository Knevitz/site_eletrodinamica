const express = require("express");
const router = express.Router();

const produtoController = require("../controllers/produtoController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const autenticarToken = authMiddleware.autenticarToken;
const apenasAdmin = authMiddleware.apenasAdmin;

// Rotas públicas
router.get("/buscar", produtoController.buscarProdutosPorTextoOuCodigo);

// Listar produtos ativos
router.get("/ativos", produtoController.listarProdutosAtivos);

// Buscar produto por slug (ativo/public)
router.get("/slug/:slug", produtoController.buscarProdutoPorSlug);

// Listar produtos ativos por categoria (slug)
router.get("/categoria/:slug", produtoController.listarProdutosPorCategoria);

// Rotas protegidas - somente admin

// Listar todos os produtos (admin)
router.get(
  "/admin",
  autenticarToken,
  apenasAdmin,
  produtoController.listarTodosProdutos
);

// Buscar produto por ID (admin)
router.get(
  "/:id",
  autenticarToken,
  apenasAdmin,
  produtoController.buscarProdutoPorId
);

// Criar produto (upload de imagem e PDF)
router.post(
  "/",
  autenticarToken,
  apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.criarProduto
);

// Atualizar produto (upload de imagem e PDF)
router.patch(
  "/:id",
  autenticarToken,
  apenasAdmin,
  upload.fields([{ name: "imagem" }, { name: "pdf" }]),
  produtoController.atualizarProduto
);

// Excluir produto
router.delete(
  "/:id",
  autenticarToken,
  apenasAdmin,
  produtoController.excluirProduto
);

module.exports = router;
