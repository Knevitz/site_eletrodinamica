const express = require("express");
const router = express.Router();
const {
  autenticarToken,
  apenasAdmin,
} = require("../middleware/authMiddleware");
const configController = require("../controllers/configController");

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

module.exports = router;
