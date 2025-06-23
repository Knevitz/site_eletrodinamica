const express = require("express");
const router = express.Router();
const {
  autenticarToken,
  apenasAdmin,
} = require("../middleware/authMiddleware");
const usuarioController = require("../controllers/usuarioController");

//Rota pública para registro ou login ficaria em outro lugar (auth)

//Acesso do CLIENTE ao próprio perfil
router.get("/me", autenticarToken, usuarioController.obterProprioPerfil);
router.put("/me", autenticarToken, usuarioController.atualizarProprioPerfil);
router.delete("/me", autenticarToken, usuarioController.excluirProprioUsuario);

//Acesso do ADMIN a qualquer cliente
router.get("/", autenticarToken, apenasAdmin, usuarioController.listarUsuarios);
router.get("/:id", autenticarToken, apenasAdmin, usuarioController.verUsuario);
router.put(
  "/:id",
  autenticarToken,
  apenasAdmin,
  usuarioController.editarUsuario
);
router.delete(
  "/:id",
  autenticarToken,
  apenasAdmin,
  usuarioController.adminExcluirUsuario
);

module.exports = router;
