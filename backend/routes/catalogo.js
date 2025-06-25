const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/uploadCatalogo");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const pastaCatalogo = path.join(__dirname, "..", "uploads", "catalogo");
const caminhoFinal = path.join(pastaCatalogo, "catalogo.pdf");

// Rota para baixar/visualizar o catálogo PDF
router.get("/arquivo", (req, res) => {
  if (!fs.existsSync(caminhoFinal)) {
    return res.status(404).json({ erro: "Catálogo não encontrado." });
  }
  res.sendFile(caminhoFinal);
});

// Rotas POST e PUT para upload (mantidas)

router.post(
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
