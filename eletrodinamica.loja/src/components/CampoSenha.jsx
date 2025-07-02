import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CampoSenha = ({ label, id, placeholder, valor, setValor }) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="input-group">
        <input
          type={mostrarSenha ? "text" : "password"}
          className="form-control"
          id={id}
          name={id}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
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
