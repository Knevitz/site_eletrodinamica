const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require("validator");
const { UniqueConstraintError } = require("sequelize");

const Usuario = require("../models/Usuario");

const gerarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
      nome: usuario.nome,
      email: usuario.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const registrar = async (req, res) => {
  let { nome, cnpj, senha, email } = req.body;

  // Sanitização
  nome = nome?.trim();
  cnpj = cnpj?.replace(/\D/g, "");
  email = email?.trim().toLowerCase();
  senha = senha?.trim();

  // Validações
  if (!nome || !cnpj || !senha || !email) {
    return res
      .status(400)
      .json({ erro: "Preencha todos os campos obrigatórios." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ erro: "Email inválido." });
  }

  if (!validator.isLength(senha, { min: 6 })) {
    return res
      .status(400)
      .json({ erro: "A senha deve ter ao menos 6 caracteres." });
  }

  if (
    !validator.isLength(cnpj, { min: 14, max: 14 }) ||
    !validator.isNumeric(cnpj)
  ) {
    return res.status(400).json({ erro: "CNPJ inválido." });
  }

  try {
    let tipo;

    if (cnpj === process.env.ADMIN_CNPJ) {
      const adminExistente = await Usuario.findOne({
        where: { cnpj, tipo: "admin" },
      });

      if (adminExistente) {
        return res
          .status(400)
          .json({ erro: "Conta de administrador já existe." });
      }

      tipo = "admin";
    } else {
      tipo = "cliente";
    }

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      cnpj,
      email,
      senha: hash,
      tipo,
    });

    res.status(201).json({
      mensagem: "Usuário registrado com sucesso.",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        cnpj: novoUsuario.cnpj,
        tipo: novoUsuario.tipo,
      },
    });
  } catch (erro) {
    if (erro instanceof UniqueConstraintError) {
      return res.status(400).json({ erro: "CNPJ ou email já está em uso" });
    }

    console.error("Erro ao registrar usuário:", erro);
    res.status(500).json({ erro: "Erro ao registrar usuário." });
  }
};

const login = async (req, res) => {
  let { cnpj, senha } = req.body;

  // Sanitização
  cnpj = cnpj?.replace(/\D/g, "");
  senha = senha?.trim();

  if (!cnpj || !senha) {
    return res.status(400).json({ erro: "CNPJ e senha são obrigatórios." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { cnpj } });

    if (!usuario) {
      return res.status(401).json({ erro: "CNPJ não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = gerarToken(usuario);

    res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).json({ erro: "Erro no login." });
  }
};

const verificarToken = (req, res) => {
  res.status(200).json({ mensagem: "Token válido." });
};

const protegido = (req, res) => {
  res.status(200).json({
    mensagem: "Acesso autorizado à rota protegida.",
    usuario: req.usuario,
  });
};

const recuperarSenha = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ mensagem: "Email inválido." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REDEFINIR_SENHA,
    });

    const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Eletrodinâmica" <${process.env.EMAIL_FROM}>`,
      to: usuario.email,
      subject: "Recuperação de Senha",
      html: `
        <p>Olá, ${usuario.nome}!</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para continuar:</p>
        <a href="${link}">${link}</a>
        <p>Este link expira em 30 minutos.</p>
      `,
    });

    return res.json({ mensagem: "E-mail de recuperação enviado com sucesso." });
  } catch (erro) {
    console.error(erro);
    return res
      .status(500)
      .json({ mensagem: "Erro ao tentar recuperar a senha." });
  }
};

const redefinirSenha = async (req, res) => {
  const { token } = req.body;
  const novaSenha = req.body.novaSenha?.trim();

  if (!token || !novaSenha) {
    return res
      .status(400)
      .json({ mensagem: "Token e nova senha são obrigatórios." });
  }

  if (!validator.isLength(novaSenha, { min: 6 })) {
    return res
      .status(400)
      .json({ mensagem: "A nova senha deve ter ao menos 6 caracteres." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    usuario.senha = senhaCriptografada;
    await usuario.save();

    return res.json({ mensagem: "Senha redefinida com sucesso." });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({ mensagem: "Token inválido ou expirado." });
  }
};

module.exports = {
  registrar,
  login,
  verificarToken,
  protegido,
  recuperarSenha,
  redefinirSenha,
};
