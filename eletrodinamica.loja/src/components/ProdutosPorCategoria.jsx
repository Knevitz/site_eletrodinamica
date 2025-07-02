import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

const ProdutosPorCategoria = () => {
  const { slug } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [categoriaNome, setCategoriaNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarProdutos = async () => {
      setCarregando(true);
      setErro(null);
      setProdutos([]);
      setCategoriaNome("");

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/produtos/categoria/${slug}`
        );
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setProdutos(data.produtos || []);
        setCategoriaNome(data.categoria || "");
      } catch (err) {
        setErro("Erro ao carregar produtos.");
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutos();
  }, [slug]);

  if (carregando) return <Spinner animation="border" />;

  return (
    <Container className="mt-5">
      <h2>{categoriaNome}</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}

      {produtos.length === 0 && !erro ? (
        <p>Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <Row>
          {produtos.map((produto) => (
            <Col key={produto.id} md={4} className="mb-4">
              <Link
                to={`/produto/${produto.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="h-100" style={{ cursor: "pointer" }}>
                  {produto.imagem && (
                    <Card.Img
                      variant="top"
                      src={`${process.env.REACT_APP_API_URL}/uploads/${produto.imagem}`}
                      alt={produto.nome}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{produto.nome}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProdutosPorCategoria;
