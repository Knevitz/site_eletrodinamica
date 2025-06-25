import React, { useState } from "react";
import api from "../services/axios";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const res = await api.post("/api/auth/recuperar-senha", { email });

      setMensagem(
        "Um e-mail foi enviado com instruções para redefinir sua senha. Verifique sua caixa de entrada e também a pasta de spam."
      );
    } catch (err) {
      const msg =
        err?.response?.data?.mensagem || "Erro ao enviar e-mail de recuperação";
      setErro(msg);
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
