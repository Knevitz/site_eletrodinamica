const { Usuario } = require("../models");

// CLIENTE
exports.obterProprioPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nome", "email", "cnpj", "tipo"],
    });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar perfil." });
  }
};

exports.atualizarProprioPerfil = async (req, res) => {
  try {
    const { nome, email } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    usuario.nome = nome ?? usuario.nome;
    usuario.email = email ?? usuario.email;

    await usuario.save();

    res.json({ mensagem: "Perfil atualizado.", usuario });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar perfil." });
  }
};

exports.excluirProprioUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    if (usuario.tipo === "admin") {
      return res
        .status(403)
        .json({ erro: "Admin não pode excluir a si mesmo." });
    }

    await usuario.destroy();
    res.json({ mensagem: "Conta excluída com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir conta." });
  }
};

// ADMIN
exports.listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nome", "email", "cnpj", "tipo", "createdAt"],
    });
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

exports.verUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ["id", "nome", "email", "cnpj", "tipo"],
    });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const { nome, email, tipo } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    console.log("Atualizando email do usuário:", usuario.id, "para:", email);

    usuario.nome = nome ?? usuario.nome;
    usuario.email = email ?? usuario.email;
    usuario.tipo = tipo ?? usuario.tipo;

    await usuario.save();

    res.json({ mensagem: "Usuário atualizado com sucesso.", usuario });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar usuário." });
  }
};

exports.adminExcluirUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    if (usuario.tipo === "admin") {
      return res.status(403).json({ erro: "Não é possível excluir o admin." });
    }

    await usuario.destroy();
    res.json({ mensagem: "Usuário excluído com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir usuário." });
  }
};
