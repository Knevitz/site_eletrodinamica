const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM, // mesmo e-mail que envia a recuperação de senha
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Envia e-mail de cotação para o destinatário configurado.
 * @param {string} destinatario - Email que receberá as cotações (configurável no admin)
 * @param {string} assunto - Assunto do email
 * @param {string} htmlConteudo - Conteúdo em HTML do email
 */
async function enviarEmailCotacao(destinatario, assunto, htmlConteudo) {
  try {
    await transporter.sendMail({
      from: `"Eletrodinâmica" <${process.env.EMAIL_FROM}>`,
      to: destinatario,
      subject: assunto,
      html: htmlConteudo,
    });
    console.log("E-mail de cotação enviado para:", destinatario);
  } catch (erro) {
    console.error("Erro ao enviar e-mail de cotação:", erro);
    throw erro;
  }
}

module.exports = { enviarEmailCotacao };
