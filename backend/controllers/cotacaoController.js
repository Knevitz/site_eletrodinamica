const Cotacao = require("../models/Cotacao");
const Usuario = require("../models/Usuario");

exports.enviarCotacao = async (req, res) => {
  try {
    const { itens } = req.body;

    // Validação básica
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: "A lista de itens é obrigatória." });
    }

    // Validação de campos de cada item
    for (const item of itens) {
      if (
        !item.nome ||
        !item.codigo ||
        typeof item.quantidade !== "number" ||
        item.quantidade <= 0
      ) {
        return res.status(400).json({
          erro: "Cada item deve conter nome, código e quantidade válida.",
        });
      }
    }

    // Criação da cotação
    const novaCotacao = await Cotacao.create({
      clienteId: req.usuario.id,
      itens,
    });

    console.log(`Cotação enviada por cliente ${req.usuario.id}:`, itens);

    res.status(201).json({
      mensagem: "Cotação enviada com sucesso.",
      cotacao: novaCotacao,
    });
  } catch (err) {
    console.error("Erro ao enviar cotação:", err);
    res.status(500).json({ erro: "Erro interno ao enviar cotação." });
  }
};

exports.getMinhasCotacoes = async (req, res) => {
  try {
    const cotacoes = await Cotacao.findAll({
      where: { clienteId: req.usuario.id },
      order: [["dataEnvio", "DESC"]],
    });

    res.status(200).json(cotacoes);
  } catch (err) {
    console.error("Erro ao buscar cotações:", err);
    res.status(500).json({ erro: "Erro ao buscar histórico de cotações." });
  }
};
