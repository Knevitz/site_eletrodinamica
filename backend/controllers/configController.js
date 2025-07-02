const ConfigSistema = require("../models/ConfigSistema");

exports.getEmailCotacao = async (req, res) => {
  try {
    const config = await ConfigSistema.findByPk("email_cotacao");
    res.json({ email: config ? config.valor : null });
  } catch (err) {
    console.error("Erro ao buscar e-mail da cotação:", err);
    res.status(500).json({ erro: "Erro ao buscar e-mail da cotação." });
  }
};

exports.setEmailCotacao = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }

  try {
    const [config, created] = await ConfigSistema.upsert(
      { chave: "email_cotacao", valor: email },
      { returning: true }
    );
    res.json({
      mensagem: "E-mail da cotação atualizado com sucesso.",
      email: config.valor,
    });
  } catch (err) {
    console.error("Erro ao atualizar e-mail da cotação:", err);
    res.status(500).json({ erro: "Erro ao atualizar e-mail da cotação." });
  }
};

exports.getEmpresaInfo = async (req, res) => {
  try {
    const config = await ConfigSistema.findByPk("email_empresa");
    res.json({ email: config ? config.valor : null });
  } catch (err) {
    console.error("Erro ao buscar dados da empresa:", err);
    res.status(500).json({ erro: "Erro ao buscar dados da empresa." });
  }
};

exports.setEmpresaInfo = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }

  try {
    const [config, created] = await ConfigSistema.upsert(
      { chave: "email_empresa", valor: email },
      { returning: true }
    );
    res.json({
      mensagem: "Informações da empresa atualizadas com sucesso.",
      email: config.valor,
    });
  } catch (err) {
    console.error("Erro ao atualizar dados da empresa:", err);
    res.status(500).json({ erro: "Erro ao atualizar dados da empresa." });
  }
};
