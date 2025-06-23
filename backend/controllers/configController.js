const ConfigSistema = require("../models/ConfigSistema");

exports.getEmailCotacao = async (req, res) => {
  try {
    const config = await ConfigSistema.findByPk("email_cotacao");
    res.json({ email: config ? config.valor : null });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar e-mail da cotação." });
  }
};

exports.setEmailCotacao = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ erro: "Email obrigatório." });

  try {
    const [config, created] = await ConfigSistema.upsert(
      { chave: "email_cotacao", valor: email },
      { returning: true }
    );
    res.json({
      mensagem: "E-mail da cotação atualizado.",
      email: config.valor,
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar e-mail da cotação." });
  }
};
