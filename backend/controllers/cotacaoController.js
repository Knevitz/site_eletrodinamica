const Cotacao = require("../models/Cotacao");
const Usuario = require("../models/Usuario");

exports.enviarCotacao = async (req, res) => {
  try {
    const { itens } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: "Itens obrigatórios." });
    }

    const nova = await Cotacao.create({
      clienteId: req.usuario.id,
      itens,
    });

    res
      .status(201)
      .json({ mensagem: "Cotação enviada com sucesso.", cotacao: nova });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao enviar cotação." });
  }
};

exports.getMinhasCotacoes = async (req, res) => {
  try {
    const cotacoes = await Cotacao.findAll({
      where: { clienteId: req.usuario.id },
      order: [["dataEnvio", "DESC"]],
    });

    res.json(cotacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar histórico." });
  }
};
