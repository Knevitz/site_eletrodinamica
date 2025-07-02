const express = require("express");
const router = express.Router();
const {
  autenticarToken,
  apenasAdmin,
} = require("../middleware/authMiddleware");
const usuarioController = require("../controllers/usuarioController");
const { Usuario } = require("../models");

// Rotas para clientes acessarem seus próprios dados
router.get("/me", autenticarToken, usuarioController.obterProprioPerfil);
router.put("/me", autenticarToken, usuarioController.atualizarProprioPerfil);
router.delete("/me", autenticarToken, usuarioController.excluirProprioUsuario);

// Rotas administrativas (apenas admin)
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

// Atualizar email do usuário (admin)
router.put("/email/:id", autenticarToken, apenasAdmin, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    usuario.email = email;
    await usuario.save();

    res.json({
      mensagem: "E-mail atualizado com sucesso.",
      email: usuario.email,
    });
  } catch (erro) {
    console.error("Erro ao atualizar email:", erro);
    res.status(500).json({ erro: "Erro interno ao atualizar e-mail." });
  }
});

module.exports = router;
