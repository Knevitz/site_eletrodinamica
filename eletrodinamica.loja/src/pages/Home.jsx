import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Carousel,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "../App.css";
const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar produtos ativos
        const resProdutos = await api.get("/api/produtos/ativos");
        const produtosData = Array.isArray(resProdutos.data)
          ? resProdutos.data
          : [];

        // Buscar categorias
        const resCategorias = await api.get("/api/categorias");
        const categoriasData = Array.isArray(resCategorias.data)
          ? resCategorias.data
          : [];

        setProdutos(produtosData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar dados da home");
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, []);

  if (carregando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (erro) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{erro}</Alert>
      </Container>
    );
  }

  // Produto representativo por categoria: pega o primeiro produto encontrado da categoria
  const produtosPorCategoria = categorias
    .map((categoria) => {
      const prod = produtos.find((p) => p.categoriaId === categoria.id);
      return prod ? { ...prod, categoriaNome: categoria.nome } : null;
    })
    .filter(Boolean);

  // Produtos agrupados por categoria para seção detalhada
  const produtosPorCategoriaMap = categorias.map((categoria) => ({
    categoria,
    produtos: produtos.filter((p) => p.categoriaId === categoria.id),
  }));

  return (
    <Container className="mt-4">
      {/* CARROSSEL */}
      {produtos.length > 0 && (
        <Carousel className="mb-5 bg-light">
          {produtos.map((produto) => (
            <Carousel.Item key={produto.id}>
              <img
                className="d-block w-100"
                src={`${API_URL}/uploads/${produto.imagem}`}
                alt={produto.nome}
                style={{
                  maxHeight: "400px",
                  objectFit: "contain",
                  backgroundColor: "white",
                  width: "100%",
                }}
              />
              <Carousel.Caption>
                <h5 className="bg-dark bg-opacity-50 rounded p-2 d-inline-block">
                  {produto.nome}
                </h5>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* PRODUTOS REPRESENTATIVOS (1 por categoria) */}
      <h3 className="mb-4">Produtos por Categoria</h3>
      <Row className="mb-5">
        {produtosPorCategoria.map((produto) => (
          <Col key={produto.id} md={4} className="mb-3">
            <Card
              className="h-100 cursor-pointer"
              onClick={() => navigate(`/produto/${produto.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src={`${API_URL}/uploads/${produto.imagem}`}
                alt={produto.nome}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{produto.nome}</Card.Title>
                <Card.Text className="text-muted">
                  {produto.categoriaNome}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* SEÇÕES POR CATEGORIA */}
      {produtosPorCategoriaMap.map(({ categoria, produtos }) => (
        <section key={categoria.id} className="mb-5">
          <h4 className="mb-3">{categoria.nome}</h4>
          {produtos.length === 0 ? (
            <Alert variant="warning">Nenhum produto nesta categoria.</Alert>
          ) : (
            <Row>
              {produtos.map((produto) => (
                <Col key={produto.id} md={3} className="mb-3">
                  <Card
                    className="h-100"
                    onClick={() => navigate(`/produto/${produto.slug}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      variant="top"
                      src={`${API_URL}/uploads/${produto.imagem}`}
                      alt={produto.nome}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title style={{ fontSize: "1rem" }}>
                        {produto.nome}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>
      ))}
    </Container>
  );
};

export default Home;
