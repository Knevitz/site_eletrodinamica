import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Image,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

const ProdutoDetalhe = () => {
  const { slug } = useParams();
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [codigoSelecionado, setCodigoSelecionado] = useState("");

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/produtos/slug/${slug}`
        );
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        setProduto(data);
      } catch (err) {
        setErro("Erro ao carregar produto.");
      } finally {
        setCarregando(false);
      }
    };

    buscarProduto();
  }, [slug]);

  const handleAdicionarAoCarrinho = () => {
    // Aqui você pode integrar com Zustand ou outro contexto
    alert(
      "Produto adicionado ao carrinho: " +
        (codigoSelecionado || produto.codigoPadrao)
    );
  };

  if (carregando) return <Spinner animation="border" className="mt-5" />;
  if (erro)
    return (
      <Alert variant="danger" className="mt-5">
        {erro}
      </Alert>
    );
  if (!produto)
    return (
      <Alert variant="warning" className="mt-5">
        Produto não encontrado.
      </Alert>
    );

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <Col md={6} className="text-center">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${produto.imagem}`}
            alt={produto.nome}
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
        </Col>
        <Col md={6}>
          <h2>{produto.nome}</h2>
          <p>{produto.descricao}</p>

          {produto.codigosPorOpcao?.length > 0 && (
            <Form.Group>
              <Form.Label>Escolha uma opção:</Form.Label>
              <Form.Select
                value={codigoSelecionado}
                onChange={(e) => setCodigoSelecionado(e.target.value)}
              >
                <option value="">Selecione</option>
                {produto.codigosPorOpcao.map((item, i) => (
                  <option key={i} value={item.codigo}>
                    {Object.values(item.opcoes).join(" / ")} – {item.codigo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Button
            variant="danger"
            className="mt-3"
            onClick={handleAdicionarAoCarrinho}
          >
            Adicionar ao Carrinho
          </Button>

          {produto.pdf && (
            <div className="mt-3">
              <a
                href={`${process.env.REACT_APP_API_URL}/uploads/${produto.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary"
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
