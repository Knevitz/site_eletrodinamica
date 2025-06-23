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

const PainelAdmin = () => {
  const navigate = useNavigate();
  const [emailCotacoes, setEmailCotacoes] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  // Função para carregar o email atual da API
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

  // Função para atualizar o email via API
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
      <h2 className="mb-4">Painel Administrativo</h2>
      <Row className="g-4">
        {/* Seus cards atuais */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Produtos</Card.Title>
              <Card.Text>Gerencie os produtos da loja virtual.</Card.Text>
              <Button
                variant="danger"
                onClick={() => navigate("/admin/produtos")}
              >
                Acessar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Clientes</Card.Title>
              <Card.Text>Pesquisar clientes e visualizar cotações.</Card.Text>
              <Button
                variant="danger"
                onClick={() => navigate("/admin/clientes")}
              >
                Acessar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Catálogo</Card.Title>
              <Card.Text>Atualize o catálogo de controladores.</Card.Text>
              <Button
                variant="danger"
                onClick={() => navigate("/admin/catalogo")}
              >
                Acessar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>E-mail para Recebimento das Cotações</Card.Title>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <>
                  <Form.Control
                    type="email"
                    placeholder="Digite o e-mail"
                    value={emailCotacoes}
                    onChange={(e) => setEmailCotacoes(e.target.value)}
                  />
                  <Button
                    className="mt-3"
                    variant="danger"
                    onClick={salvarEmail}
                  >
                    Salvar
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
