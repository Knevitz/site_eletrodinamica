import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CNPJ from "../components/CNPJ";
import "../App.css";
import "./login.css";
import loginImage from "../assets/foto-divulgacao.jpg";
import CampoSenha from "../components/CampoSenha";
import api from "../services/axios";

const Login = () => {
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    try {
      const res = await api.post("/api/auth/login", {
        cnpj: cnpjLimpo,
        senha,
      });

      const { token, usuario } = res.data;

      if (!token || !usuario) {
        throw new Error("Resposta inesperada do servidor.");
      }

      localStorage.setItem("token", token);

      if (usuario.tipo === "admin") {
        navigate("/admin");
      } else if (usuario.tipo === "cliente") {
        navigate("/cliente");
      } else {
        setErro("Tipo de usuário inválido.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro(
        err.response?.data?.erro || err.message || "Erro ao tentar fazer login."
      );
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-login">
      <div className="row bg-white login-card overflow-hidden w-100">
        <div className="col-md-6 p-0 d-none d-md-block">
          <img
            src={loginImage}
            alt="Imagem Login"
            className="img-fluid h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6 p-4 d-flex flex-column align-items-center justify-content-center">
          <h2 className="text-center text-danger mb-4">Acesse sua conta</h2>
          <form style={{ width: "100%" }} onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="cnpj" className="form-label">
                CNPJ
              </label>
              <CNPJ
                id="cnpj"
                name="cnpj"
                className="form-control"
                value={cnpj}
                onChange={setCnpj}
                required
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
            {erro && (
              <div className="alert alert-danger text-center">{erro}</div>
            )}
            <button type="submit" className="btn btn-danger w-100">
              Login
            </button>
            <div className="mt-3">
              <Link to="/recuperar-senha" className="text-danger">
                Esqueci minha senha
              </Link>
            </div>
          </form>
          <p className="mt-4 text-center">
            Não tem uma conta?{" "}
            <Link to="/registrar" className="text-danger">
              Registre-se
            </Link>
          </p>
        </div>

        <div className="col-12 p-0 d-md-none">
          <img
            src={loginImage}
            alt="Imagem Login"
            className="img-fluid"
            style={{ objectFit: "cover", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
