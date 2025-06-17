import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CampoSenha = ({ senha, setSenha }) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor="password" className="form-label">
        Senha
      </label>
      <div className="input-group">
        <input
          type={mostrarSenha ? "text" : "password"}
          className="form-control"
          id="password"
          name="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          tabIndex={-1}
          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
        >
          {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default CampoSenha;
