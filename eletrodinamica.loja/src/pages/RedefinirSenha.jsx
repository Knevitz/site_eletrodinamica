import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoSenha from "../components/CampoSenha";

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/redefinir-senha`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, novaSenha }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao redefinir senha.");
      }

      setMensagem(
        "Senha redefinida com sucesso! Você será redirecionado para a página de login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <CampoSenha
          label="Nova senha"
          id="novaSenha"
          placeholder="Digite a nova senha"
          valor={novaSenha}
          setValor={setNovaSenha}
        />

        <CampoSenha
          label="Confirmar nova senha"
          id="confirmarNovaSenha"
          placeholder="Confirme a nova senha"
          valor={confirmarSenha}
          setValor={setConfirmarSenha}
        />

        {mensagem && <div className="alert alert-success mt-3">{mensagem}</div>}
        {erro && <div className="alert alert-danger mt-3">{erro}</div>}
        <button type="submit" className="btn btn-danger mt-3">
          Redefinir
        </button>
      </form>
    </div>
  );
};

export default RedefinirSenha;
