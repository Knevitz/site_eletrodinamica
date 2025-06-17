import React, { useState } from "react";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/recuperar-senha`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao enviar e-mail");
      }

      setMensagem(
        "Um e-mail foi enviado com instruções para redefinir sua senha. Verifique sua caixa de entrada e também a pasta de spam."
      );
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail cadastrado
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seuemail@exemplo.com"
          />
        </div>
        {mensagem && <div className="alert alert-success">{mensagem}</div>}
        {erro && <div className="alert alert-danger">{erro}</div>}
        <button type="submit" className="btn btn-danger">
          Enviar instruções por e-mail
        </button>
      </form>
    </div>
  );
};

export default RecuperarSenha;
