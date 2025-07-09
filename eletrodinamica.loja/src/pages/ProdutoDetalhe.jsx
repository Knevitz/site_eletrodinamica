import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import api from "../services/axios";
import SeletorDeCodigo from "../components/SeletorDeCodigo";
import useCarrinhoStore from "../store/carrinhoStore";

const ProdutoDetalhe = () => {
  const { slug } = useParams();
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [codigoSelecionado, setCodigoSelecionado] = useState("");
  const [adicionado, setAdicionado] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        const res = await api.get(`api/produtos/slug/${slug}`);
        if (!res.data || typeof res.data !== "object") {
          throw new Error("Produto não encontrado.");
        }
        setProduto(res.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setErro("Erro ao carregar produto. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    };

    if (slug) {
      buscarProduto();
    } else {
      setErro("Produto inválido.");
      setCarregando(false);
    }
  }, [slug]);

  const temCodigosPorOpcao =
    produto &&
    Array.isArray(produto.codigosPorOpcao) &&
    produto.codigosPorOpcao.length > 0;

  const codigoAtual = temCodigosPorOpcao
    ? codigoSelecionado
    : produto?.codigoPadrao || "";

  if (carregando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (erro) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{erro}</Alert>
      </Container>
    );
  }

  if (!produto) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Produto não encontrado.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <Col md={6} className="text-center mb-4 mb-md-0">
          {produto.imagem ? (
            <img
              src={`${API_URL}uploads/${produto.imagem}`}
              alt={produto.nome || "Imagem do produto"}
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          ) : (
            <p className="text-muted">Imagem não disponível</p>
          )}
        </Col>

        <Col md={6}>
          <h2>{produto.nome || "Nome indisponível"}</h2>
          <p>{produto.descricao || "Descrição indisponível."}</p>

          {temCodigosPorOpcao ? (
            <>
              <SeletorDeCodigo
                opcoesSelect={produto.opcoesSelect}
                codigosPorOpcao={produto.codigosPorOpcao}
                onCodigoSelecionado={setCodigoSelecionado}
              />

              {codigoSelecionado && (
                <p className="mt-2">
                  Código selecionado: <strong>{codigoSelecionado}</strong>
                </p>
              )}
            </>
          ) : (
            <p>
              Código: <strong>{produto.codigoPadrao || "Indisponível"}</strong>
            </p>
          )}

          <Button
            variant={adicionado ? "success" : "danger"}
            className="mt-2 w-100"
            onClick={() => {
              if (!codigoAtual) return;
              useCarrinhoStore.getState().adicionar({
                nome: produto.nome,
                slug: produto.slug,
                imagem: produto.imagem,
                codigo: codigoAtual,
              });

              // Mostrar feedback no botão
              setAdicionado(true);
              setTimeout(() => setAdicionado(false), 1500);
            }}
            disabled={!codigoAtual}
          >
            {adicionado ? "✅" : "Adicionar ao Carrinho"}
          </Button>

          {produto.pdf && typeof produto.pdf === "string" && (
            <div className="mt-4">
              <a
                href={`${API_URL}uploads/${produto.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary w-100"
              >
                Baixar manual (PDF)
              </a>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProdutoDetalhe;
