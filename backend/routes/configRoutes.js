const express = require("express");
const router = express.Router();
const {
  autenticarToken,
  apenasAdmin,
} = require("../middleware/authMiddleware");
const configController = require("../controllers/configController");

// Rotas protegidas para configuração do sistema
router.get(
  "/email-cotacao",
  autenticarToken,
  apenasAdmin,
  configController.getEmailCotacao
);

router.put(
  "/email-cotacao",
  autenticarToken,
  apenasAdmin,
  configController.setEmailCotacao
);

router.get(
  "/empresa",
  autenticarToken,
  apenasAdmin,
  configController.getEmpresaInfo
);

router.put(
  "/empresa",
  autenticarToken,
  apenasAdmin,
  configController.setEmpresaInfo
);

module.exports = router;
