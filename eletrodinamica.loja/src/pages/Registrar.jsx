import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CNPJ from "../components/CNPJ";
import registerImage from "../assets/foto-divulgacao.jpg";
import CampoSenha from "../components/CampoSenha";
import api from "../services/axios"; // import axios customizado

const Registrar = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !cnpj || !senha || !confirmaSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmaSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    try {
      await api.post("/api/auth/registrar", {
        nome,
        email,
        cnpj: cnpjLimpo,
        senha,
      });

      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.erro || "Erro inesperado";
      setErro(msg);
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-0 border rounded overflow-hidden shadow">
        <div className="col-lg-6 d-none d-lg-block">
          <img
            src={registerImage}
            alt="Cadastro"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-lg-6 col-12 p-4 d-flex flex-column justify-content-center">
          <h2 className="text-center text-danger mb-4">Criar Conta</h2>

          <form onSubmit={handleRegistro}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cnpj" className="form-label">
                CNPJ
              </label>
              <CNPJ
                id="cnpj"
                className="form-control"
                value={cnpj}
                onChange={setCnpj}
              />
            </div>

            <div className="mb-3">
              <CampoSenha
                label="Senha"
                id="senha"
                placeholder="Digite sua senha"
                valor={senha}
                setValor={setSenha}
              />
            </div>

            <div className="mb-3">
              <CampoSenha
                label="Confirmar Senha"
                id="confirmarSenha"
                placeholder="Confirme sua senha"
                valor={confirmaSenha}
                setValor={setConfirmaSenha}
              />
            </div>

            {erro && (
              <div className="alert alert-danger text-center">{erro}</div>
            )}

            <button type="submit" className="btn btn-danger w-100">
              Registrar
            </button>
          </form>

          <p className="mt-3 text-center">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-danger">
              Faça login
            </Link>
          </p>
        </div>

        <div className="col-12 d-lg-none">
          <img src={registerImage} alt="Cadastro" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Registrar;
