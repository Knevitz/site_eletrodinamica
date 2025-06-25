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
  FaBuilding,
} from "react-icons/fa";
import api from "../services/axios";

const AdminCard = ({ icon: Icon, title, description, variant, onClick }) => (
  <Card className="shadow-sm h-100">
    <Card.Body className="d-flex flex-column">
      <Card.Title
        className={`d-flex align-items-center gap-2 text-${variant} fw-semibold`}
      >
        <Icon size={24} />
        {title}
      </Card.Title>
      <Card.Text className="flex-grow-1">{description}</Card.Text>
      <Button variant={variant} onClick={onClick} className="mt-auto">
        Acessar {title}
      </Button>
    </Card.Body>
  </Card>
);

const PainelAdmin = () => {
  const navigate = useNavigate();
  const [emailCotacoes, setEmailCotacoes] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const carregarEmail = async () => {
    try {
      const res = await api.get("/api/config/email-cotacao");
      setEmailCotacoes(res.data.email || "");
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o e-mail de cotações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmail();
  }, []);

  const salvarEmail = async () => {
    setErro(null);
    setMensagem(null);

    if (!/\S+@\S+\.\S+/.test(emailCotacoes)) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await api.put("/api/config/email-cotacao", { email: emailCotacoes });
      setMensagem("E-mail atualizado com sucesso.");
    } catch (err) {
      console.error(err);
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
          <AdminCard
            icon={FaBoxOpen}
            title="Produtos"
            description="Gerencie os produtos da loja virtual com facilidade."
            variant="danger"
            onClick={() => navigate("/admin/produtos")}
          />
        </Col>
        <Col md={4}>
          <AdminCard
            icon={FaTags}
            title="Categorias"
            description="Organize e controle as categorias disponíveis."
            variant="warning"
            onClick={() => navigate("/admin/categorias")}
          />
        </Col>
        <Col md={4}>
          <AdminCard
            icon={FaUsers}
            title="Clientes"
            description="Pesquise clientes e visualize suas cotações."
            variant="primary"
            onClick={() => navigate("/admin/clientes")}
          />
        </Col>
        <Col md={4}>
          <AdminCard
            icon={FaBuilding}
            title="Informações da Empresa"
            description="Gerencie as informações da conta administrativa."
            variant="secondary"
            onClick={() => navigate("/admin/empresa")}
          />
        </Col>
        <Col md={4}>
          <AdminCard
            icon={FaBookOpen}
            title="Catálogo"
            description="Atualize o catálogo de controladores disponível para os clientes."
            variant="success"
            onClick={() => navigate("/admin/catalogo")}
          />
        </Col>

        {/* E-mail de cotações */}
        <Col md={4}>
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
