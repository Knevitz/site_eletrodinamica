const Cotacao = require("../models/Cotacao");
const Usuario = require("../models/Usuario");
const ConfigSistema = require("../models/ConfigSistema");
const { enviarEmailCotacao } = require("../utils/emailCotacao");

exports.enviarCotacao = async (req, res) => {
  try {
    const { itens } = req.body;

    // Validação dos itens
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: "A lista de itens é obrigatória." });
    }

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

    // Busca os dados do cliente
    const cliente = await Usuario.findByPk(req.usuario.id);
    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    // Busca o e-mail configurado para receber cotações
    const configEmail = await ConfigSistema.findByPk("email_cotacao");
    const emailDestino = configEmail?.valor || process.env.EMAIL_TO;

    // Monta o HTML do e-mail
    const corpoHtml = `
  <h2>Nova Cotação Recebida</h2>
  <p><strong>Cliente:</strong> ${cliente.nome}</p>
  <p><strong>CNPJ:</strong> ${cliente.cnpj}</p>
  <p><strong>Email:</strong> ${cliente.email}</p>
  <p><strong>Nº:</strong> ${novaCotacao.id}</p>
  <br/>
  <h3>Itens:</h3>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Código</th>
        <th>Quantidade</th>
      </tr>
    </thead>
    <tbody>
      ${itens
        .map(
          (item) => `
            <tr>
              <td>${item.nome}</td>
              <td>${item.codigo}</td>
              <td>${item.quantidade}</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

    // Envia o e-mail de cotação
    await enviarEmailCotacao(
      emailDestino,
      "Nova Cotação Recebida - Site Eletrodinâmica",
      corpoHtml
    );

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
