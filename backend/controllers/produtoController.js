const Produto = require("../models/Produto");
const CodigosPorOpcao = require("../models/CodigosPorOpcao");
const path = require("path");
const fs = require("fs");
const slugify = require("../utils/slugify");

// Função auxiliar para deletar arquivos antigos
const deletarArquivoSeExistir = (caminho) => {
  if (fs.existsSync(caminho)) {
    fs.unlinkSync(caminho);
  }
};

// Função segura para parsear JSON
const tentarParseJSON = (input) => {
  try {
    return typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    return null;
  }
};

// Criar produto
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

  // Validação: código padrão é obrigatório se não houver códigos por opção
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

    // Se houver códigos por opção, criar em massa
    if (codigos?.length) {
      const codigosComId = codigos.map((c) => ({
        ...c,
        produtoId: novoProduto.id,
      }));
      await CodigosPorOpcao.bulkCreate(codigosComId);
    }

    const produtoCompleto = await Produto.findByPk(novoProduto.id, {
      include: [CodigosPorOpcao],
    });

    res.status(201).json(produtoCompleto);
  } catch (erro) {
    console.error("Erro ao criar produto:", erro);
    res.status(500).json({ erro: "Erro ao criar produto." });
  }
};

// Atualizar produto
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
    req.body.codigoPadrao === undefined &&
    req.body.codigosPorOpcao === undefined
  ) {
    // não faz nada, deixa passar (ou validação leve)
  } else if (
    !req.body.codigoPadrao &&
    (!req.body.codigosPorOpcao || req.body.codigosPorOpcao.length === 0)
  ) {
    return res.status(400).json({
      erro: "É obrigatório ter 'codigoPadrao' quando 'codigosPorOpcao' estiver vazio.",
    });
  }

  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    // Atualizar imagem
    if (req.files?.imagem?.[0]) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.imagem)
      );
      produto.imagem = req.files.imagem[0].filename;
    }

    // Atualizar PDF
    if (req.files?.pdf?.[0]) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.pdf)
      );
      produto.pdf = req.files.pdf[0].filename;
    }

    // Atualizar campos
    if (nome && nome !== produto.nome) {
      produto.nome = nome;
      produto.slug = slugify(nome);
    }

    if (descricao !== undefined) produto.descricao = descricao;
    if (ativo !== undefined) produto.ativo = ativo;
    if (categoriaId !== undefined) produto.categoriaId = categoriaId;
    if (codigoPadrao) produto.codigoPadrao = codigoPadrao;
    if (novasOpcoes) produto.opcoesSelect = novasOpcoes;

    await produto.save();

    // Atualizar códigos por opção
    await CodigosPorOpcao.destroy({ where: { produtoId: produto.id } });

    if (novosCodigos?.length) {
      const codigosComId = novosCodigos.map((c) => ({
        ...c,
        produtoId: produto.id,
      }));
      await CodigosPorOpcao.bulkCreate(codigosComId);
    }

    const produtoAtualizado = await Produto.findByPk(produto.id, {
      include: [CodigosPorOpcao],
    });

    res.status(200).json(produtoAtualizado);
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);
    res.status(500).json({
      erro: "Erro ao atualizar produto.",
      detalhes: erro.message,
    });
  }
};

// Excluir produto
exports.excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    // Deletar arquivos se existirem
    if (produto.imagem) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.imagem)
      );
    }
    if (produto.pdf) {
      deletarArquivoSeExistir(
        path.join(__dirname, "..", "uploads", produto.pdf)
      );
    }

    // Deletar variações
    await CodigosPorOpcao.destroy({ where: { produtoId: produto.id } });

    await produto.destroy();
    res.status(200).json({ mensagem: "Produto excluído com sucesso." });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);
    res.status(500).json({ erro: "Erro ao excluir produto." });
  }
};

// Listar produtos ativos (público)
exports.listarProdutosAtivos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      where: { ativo: true },
      include: [CodigosPorOpcao],
    });
    res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao listar produtos ativos:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};

// Buscar produtos por id
exports.buscarProdutoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findByPk(id, {
      include: [CodigosPorOpcao],
    });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    res.status(200).json(produto);
  } catch (erro) {
    console.error("Erro ao buscar produto por ID:", erro);
    res.status(500).json({ erro: "Erro ao buscar produto." });
  }
};

// Listar todos os produtos para admin
exports.listarTodosProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [CodigosPorOpcao],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao listar todos produtos:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};
