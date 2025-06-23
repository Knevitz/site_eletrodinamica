import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaTags,
  FaUsers,
  FaBookOpen,
  FaEnvelope,
} from "react-icons/fa";

const PainelAdmin = () => {
  const navigate = useNavigate();
  const [emailCotacoes, setEmailCotacoes] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const carregarEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/config/email-cotacao`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao carregar email");
      const data = await res.json();
      setEmailCotacoes(data.email || "");
      setLoading(false);
    } catch {
      setErro("Não foi possível carregar o e-mail de cotações.");
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmail();
  }, []);

  const salvarEmail = async () => {
    setErro(null);
    setMensagem(null);
    if (!emailCotacoes || !/\S+@\S+\.\S+/.test(emailCotacoes)) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/config/email-cotacao`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: emailCotacoes }),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar e-mail");
      setMensagem("E-mail atualizado com sucesso.");
    } catch {
      setErro("Erro ao atualizar o e-mail. Tente novamente.");
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">
        Painel Administrativo
      </h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="d-flex align-items-center gap-2 text-danger fw-semibold">
                <FaBoxOpen size={24} />
                Produtos
              </Card.Title>
              <Card.Text className="flex-grow-1">
                Gerencie os produtos da loja virtual com facilidade.
              </Card.Text>
              <Button
                variant="danger"
                onClick={() => navigate("/admin/produtos")}
                className="mt-auto"
              >
                Acessar Produtos
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="d-flex align-items-center gap-2 text-warning fw-semibold">
                <FaTags size={24} />
                Categorias
              </Card.Title>
              <Card.Text className="flex-grow-1">
                Organize e controle as categorias disponíveis.
              </Card.Text>
              <Button
                variant="warning"
                onClick={() => navigate("/admin/categorias")}
                className="mt-auto"
              >
                Acessar Categorias
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="d-flex align-items-center gap-2 text-primary fw-semibold">
                <FaUsers size={24} />
                Clientes
              </Card.Title>
              <Card.Text className="flex-grow-1">
                Pesquise clientes e visualize suas cotações.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/admin/clientes")}
                className="mt-auto"
              >
                Acessar Clientes
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="d-flex align-items-center gap-2 text-success fw-semibold">
                <FaBookOpen size={24} />
                Catálogo
              </Card.Title>
              <Card.Text className="flex-grow-1">
                Atualize o catálogo de controladores disponível para os
                clientes.
              </Card.Text>
              <Button
                variant="success"
                onClick={() => navigate("/admin/catalogo")}
                className="mt-auto"
              >
                Acessar Catálogo
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2 text-danger fw-semibold">
                <FaEnvelope size={24} />
                E-mail para Recebimento das Cotações
              </Card.Title>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <>
                  <Form.Control
                    type="email"
                    placeholder="Digite o e-mail para receber cotações"
                    value={emailCotacoes}
                    onChange={(e) => setEmailCotacoes(e.target.value)}
                  />
                  <Button
                    variant="danger"
                    className="mt-3 w-100"
                    onClick={salvarEmail}
                  >
                    Salvar E-mail
                  </Button>
                  {mensagem && (
                    <Alert variant="success" className="mt-3">
                      {mensagem}
                    </Alert>
                  )}
                  {erro && (
                    <Alert variant="danger" className="mt-3">
                      {erro}
                    </Alert>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PainelAdmin;
