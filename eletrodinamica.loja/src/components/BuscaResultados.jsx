import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const BuscaResultados = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }api/produtos/buscar?q=${encodeURIComponent(q)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro na busca");
        return res.json();
      })
      .then((data) => setResultados(data))
      .catch((err) => {
        console.error(err);
        setResultados([]);
      })
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) return <p>Informe um termo para buscar.</p>;
  if (loading) return <p>Carregando resultados...</p>;
  if (resultados.length === 0)
    return <p>Nenhum produto encontrado para "{q}".</p>;

  return (
    <div>
      <h2>Resultados para "{q}":</h2>
      <ul>
        {resultados.map((produto) => (
          <li key={produto.id}>
            <Link to={`/produto/${produto.slug}`}>
              {produto.nome} - Código: {produto.codigoPadrao}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscaResultados;
