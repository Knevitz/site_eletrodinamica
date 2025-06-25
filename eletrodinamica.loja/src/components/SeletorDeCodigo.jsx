import React, { useState, useEffect } from "react";

const SeletorDeCodigo = ({
  opcoesSelect,
  codigosPorOpcao,
  onCodigoSelecionado,
}) => {
  const [selecionado, setSelecionado] = useState({});
  const [codigoEncontrado, setCodigoEncontrado] = useState("");

  useEffect(() => {
    const todasAsOpcoesSelecionadas =
      Object.keys(opcoesSelect).length > 0 &&
      Object.keys(selecionado).length === Object.keys(opcoesSelect).length;

    if (todasAsOpcoesSelecionadas) {
      const encontrado = codigosPorOpcao.find((item) =>
        Object.entries(item.opcoes).every(
          ([chave, valor]) => selecionado[chave] === valor
        )
      );

      const codigo = encontrado?.codigo || "";
      setCodigoEncontrado(codigo);
      onCodigoSelecionado?.(codigo);
    } else {
      setCodigoEncontrado("");
      onCodigoSelecionado?.("");
    }
  }, [selecionado, opcoesSelect, codigosPorOpcao, onCodigoSelecionado]);

  const handleChange = (opcao, valor) => {
    setSelecionado((prev) => ({ ...prev, [opcao]: valor }));
  };

  return (
    <div>
      {Object.entries(opcoesSelect).map(([opcao, valores]) => (
        <div key={opcao} className="mb-3">
          <label className="form-label">
            <strong>{opcao}:</strong>
          </label>
          <select
            className="form-select"
            value={selecionado[opcao] || ""}
            onChange={(e) => handleChange(opcao, e.target.value)}
          >
            <option value="">Selecione</option>
            {valores.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default SeletorDeCodigo;
