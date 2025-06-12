const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/uploadCatalogo");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const pastaCatalogo = path.join(__dirname, "..", "uploads", "catalogo");
const caminhoFinal = path.join(pastaCatalogo, "catalogo.pdf");

router.post(
  "/",
  auth.autenticarToken,
  auth.apenasAdmin,
  upload.single("catalogo"),
  async (req, res) => {
    try {
      // Se já existir um catálogo antigo, deleta
      if (fs.existsSync(caminhoFinal)) {
        fs.unlinkSync(caminhoFinal);
      }

      // Move o novo PDF com nome fixo "catalogo.pdf"
      fs.renameSync(req.file.path, caminhoFinal);

      return res
        .status(200)
        .json({ mensagem: "Catálogo enviado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao salvar catálogo:", erro);
      return res.status(500).json({ erro: "Erro ao salvar catálogo." });
    }
  }
);

router.put(
  "/",
  auth.autenticarToken,
  auth.apenasAdmin,
  upload.single("catalogo"),
  async (req, res) => {
    try {
      if (fs.existsSync(caminhoFinal)) {
        fs.unlinkSync(caminhoFinal);
      }

      fs.renameSync(req.file.path, caminhoFinal);

      return res
        .status(200)
        .json({ mensagem: "Catálogo atualizado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao atualizar catálogo:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar catálogo." });
    }
  }
);

module.exports = router;
