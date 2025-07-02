const Produto = require("../models/Produto");
const CodigosPorOpcao = require("../models/CodigosPorOpcao");
const path = require("path");
const fs = require("fs");
const slugify = require("../utils/slugify");
const Categoria = require("../models/Categoria");

const tentarParseJSON = (input) => {
  try {
    return typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    return null;
  }
};

const deletarArquivoSeExistir = (caminho) => {
  fs.access(caminho, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(caminho, (err) => {
        if (err) console.error(`Erro ao deletar ${caminho}:`, err);
      });
    }
  });
};

const parseProdutoJSONFields = (produto) => {
  if (!produto) return produto;
  produto.opcoesSelect = tentarParseJSON(produto.opcoesSelect) || {};
  produto.codigosPorOpcao = produto.codigosPorOpcao || [];
  return produto;
};
const { Op } = require("sequelize");

const incluirCodigos = async (produtoId, codigos) => {
  if (!codigos?.length) return;
  const codigosComId = codigos.map((c) => ({ ...c, produtoId }));
  await CodigosPorOpcao.bulkCreate(codigosComId);
};

exports.buscarProdutoPorSlug = async (req, res) => {
  try {
    const produto = await Produto.findOne({
      where: { slug: req.params.slug, ativo: true },
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
    });
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado." });
    parseProdutoJSONFields(produto);
    res.status(200).json(produto);
  } catch (erro) {
    console.error("Erro ao buscar produto por slug:", erro);
    res.status(500).json({ erro: "Erro ao buscar produto por slug." });
  }
};

exports.buscarProdutosPorTextoOuCodigo = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ erro: "Parâmetro de busca 'q' é obrigatório." });
  }

  try {
    const produtos = await Produto.findAll({
      where: {
        ativo: true,
        [Op.or]: [
          { nome: { [Op.like]: `%${q}%` } },
          { codigoPadrao: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: CodigosPorOpcao,
          as: "codigosPorOpcao",
          required: false,
        },
      ],
      order: [["nome", "ASC"]],
    });

    // Agora, buscar produtos que não tenham códigoPadrao ou nome que combinem,
    // mas que tenham códigos por opção que combinem
    const produtosPorCodigoOpcao = await Produto.findAll({
      where: { ativo: true },
      include: [
        {
          model: CodigosPorOpcao,
          as: "codigosPorOpcao",
          required: true,
          where: {
            codigo: { [Op.like]: `%${q}%` },
          },
        },
      ],
      order: [["nome", "ASC"]],
    });

    // Evitar duplicatas
    const mapa = new Map();
    [...produtos, ...produtosPorCodigoOpcao].forEach((p) =>
      mapa.set(p.id, parseProdutoJSONFields(p))
    );

    const resultados = Array.from(mapa.values());
    res.status(200).json(resultados);
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};

exports.listarProdutosPorCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findOne({
      where: { slug: req.params.slug },
    });
    if (!categoria)
      return res.status(404).json({ erro: "Categoria não encontrada." });
    const produtos = await Produto.findAll({
      where: { categoriaId: categoria.id, ativo: true },
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
      order: [["nome", "ASC"]],
    });
    produtos.forEach(parseProdutoJSONFields);
    res.status(200).json({ categoria: categoria.nome, produtos });
  } catch (erro) {
    console.error("Erro ao buscar produtos por categoria:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos por categoria." });
  }
};

exports.criarProduto = async (req, res) => {
  const {
    nome,
    descricao,
    categoriaId,
    codigoPadrao,
    opcoesSelect,
    codigosPorOpcao,
  } = req.body;
  const imagem = req.files?.imagem?.[0]?.filename || null;
  const pdf = req.files?.pdf?.[0]?.filename || null;
  const slug = slugify(nome);
  const opcoes = tentarParseJSON(opcoesSelect);
  const codigos = tentarParseJSON(codigosPorOpcao);

  if (!codigos?.length && !codigoPadrao) {
    return res.status(400).json({
      erro: "É obrigatório informar o código padrão se o produto não tiver códigos por opção.",
    });
  }

  try {
    const novoProduto = await Produto.create({
      nome,
      descricao,
      categoriaId,
      imagem,
      pdf,
      slug,
      codigoPadrao,
      opcoesSelect: opcoes || null,
    });

    await incluirCodigos(novoProduto.id, codigos);

    const produtoCompleto = await Produto.findByPk(novoProduto.id, {
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
    });
    parseProdutoJSONFields(produtoCompleto);
    res.status(201).json(produtoCompleto);
  } catch (erro) {
    console.error("Erro ao criar produto:", erro);
    res.status(500).json({ erro: "Erro ao criar produto." });
  }
};

exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    ativo,
    categoriaId,
    codigoPadrao,
    opcoesSelect,
    codigosPorOpcao,
  } = req.body;
  const novosCodigos = tentarParseJSON(codigosPorOpcao);
  const novasOpcoes = tentarParseJSON(opcoesSelect);

  if (
    req.body.codigoPadrao !== undefined ||
    req.body.codigosPorOpcao !== undefined
  ) {
    if (!codigoPadrao && (!novosCodigos || novosCodigos.length === 0)) {
      return res.status(400).json({
        erro: "É obrigatório ter 'codigoPadrao' quando 'codigosPorOpcao' estiver vazio.",
      });
    }
  }

  try {
    const produto = await Produto.findByPk(id);
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado." });

    if (req.files?.imagem?.[0]) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.imagem)
      );
      produto.imagem = req.files.imagem[0].filename;
    }
    if (req.files?.pdf?.[0]) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.pdf)
      );
      produto.pdf = req.files.pdf[0].filename;
    }
    if (nome && nome !== produto.nome) {
      produto.nome = nome;
      produto.slug = slugify(nome);
    }
    if (descricao !== undefined) produto.descricao = descricao;
    if (ativo !== undefined) produto.ativo = ativo;
    if (categoriaId !== undefined) produto.categoriaId = categoriaId;
    if (codigoPadrao !== undefined) produto.codigoPadrao = codigoPadrao;
    if (novasOpcoes !== undefined) produto.opcoesSelect = novasOpcoes;

    await produto.save();
    await CodigosPorOpcao.destroy({ where: { produtoId: produto.id } });
    await incluirCodigos(produto.id, novosCodigos);

    const produtoAtualizado = await Produto.findByPk(produto.id, {
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
    });
    parseProdutoJSONFields(produtoAtualizado);
    res.status(200).json(produtoAtualizado);
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);
    res
      .status(500)
      .json({ erro: "Erro ao atualizar produto.", detalhes: erro.message });
  }
};

exports.excluirProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado." });
    if (produto.imagem)
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.imagem)
      );
    if (produto.pdf)
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.pdf)
      );
    await CodigosPorOpcao.destroy({ where: { produtoId: produto.id } });
    await produto.destroy();
    res.status(200).json({ mensagem: "Produto excluído com sucesso." });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);
    res.status(500).json({ erro: "Erro ao excluir produto." });
  }
};

exports.listarProdutosAtivos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      where: { ativo: true },
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
    });
    produtos.forEach(parseProdutoJSONFields);
    res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao listar produtos ativos:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};

exports.buscarProdutoPorId = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
    });
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado." });
    parseProdutoJSONFields(produto);
    res.status(200).json(produto);
  } catch (erro) {
    console.error("Erro ao buscar produto por ID:", erro);
    res.status(500).json({ erro: "Erro ao buscar produto." });
  }
};

exports.listarTodosProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [{ model: CodigosPorOpcao, as: "codigosPorOpcao" }],
      order: [["createdAt", "DESC"]],
    });
    produtos.forEach(parseProdutoJSONFields);
    res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao listar todos produtos:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};
