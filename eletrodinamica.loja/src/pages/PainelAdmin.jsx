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
import { jwtDecode } from "jwt-decode";
import api from "../services/axios";

const formatarCNPJ = (cnpj) => {
  if (!cnpj) return "";
  return cnpj
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

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
  const [idUsuario, setIdUsuario] = useState(null);
  const [loadingDados, setLoadingDados] = useState(true);

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpjEmpresa, setCnpjEmpresa] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [emailEmpresaEdicao, setEmailEmpresaEdicao] = useState("");
  const [emailCotacoes, setEmailCotacoes] = useState("");

  const [mensagemEmpresa, setMensagemEmpresa] = useState(null);
  const [erroEmpresa, setErroEmpresa] = useState(null);
  const [mensagemCotacoes, setMensagemCotacoes] = useState(null);
  const [erroCotacoes, setErroCotacoes] = useState(null);
  const [editandoEmpresa, setEditandoEmpresa] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setIdUsuario(decoded.id);
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  useEffect(() => {
    if (!idUsuario) return;

    const carregarDados = async () => {
      try {
        const resEmpresa = await api.get(`/api/usuarios/${idUsuario}`);
        setNomeEmpresa(resEmpresa.data.nome || "");
        setCnpjEmpresa(resEmpresa.data.cnpj || "");
        setEmailEmpresa(resEmpresa.data.email || "");
        setEmailEmpresaEdicao(resEmpresa.data.email || "");

        const resCotacoes = await api.get("/api/config/email-cotacao");
        setEmailCotacoes(resCotacoes.data.email || "");

        setErroEmpresa(null);
        setErroCotacoes(null);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
        setErroEmpresa("Erro ao carregar dados da empresa.");
        setErroCotacoes("Erro ao carregar e-mail de cotações.");
      } finally {
        setLoadingDados(false);
      }
    };

    carregarDados();
  }, [idUsuario]);

  const salvarEmailEmpresa = async () => {
    setErroEmpresa(null);
    setMensagemEmpresa(null);

    if (!/\S+@\S+\.\S+/.test(emailEmpresaEdicao)) {
      setErroEmpresa("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      setEditandoEmpresa(true);
      await api.put(`/api/usuarios/${idUsuario}`, {
        email: emailEmpresaEdicao,
      });
      setMensagemEmpresa("E-mail administrativo atualizado com sucesso.");
      setEmailEmpresa(emailEmpresaEdicao);
    } catch (err) {
      console.error("Erro ao atualizar e-mail administrativo:", err);
      setErroEmpresa("Erro ao atualizar o e-mail administrativo.");
    } finally {
      setEditandoEmpresa(false);
    }
  };

  const salvarEmailCotacoes = async () => {
    setErroCotacoes(null);
    setMensagemCotacoes(null);

    if (!/\S+@\S+\.\S+/.test(emailCotacoes)) {
      setErroCotacoes("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await api.put("/api/config/email-cotacao", { email: emailCotacoes });
      setMensagemCotacoes("E-mail de cotações atualizado com sucesso.");
    } catch (err) {
      console.error("Erro ao atualizar e-mail de cotações:", err);
      setErroCotacoes("Erro ao atualizar o e-mail de cotações.");
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">
        Painel Administrativo
      </h2>
      <Row className="g-4">
        <Col md={12}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title className="d-flex justify-content-center align-items-center gap-2 text-danger fw-semibold">
                <FaBuilding size={24} />
                Dados da Empresa
              </Card.Title>
              {loadingDados ? (
                <p>Carregando...</p>
              ) : (
                <>
                  <div className="mb-3">
                    <strong>Nome:</strong>
                    <p>{nomeEmpresa || "Não encontrado"}</p>
                  </div>
                  <div className="mb-3">
                    <strong>CNPJ:</strong>
                    <p>{formatarCNPJ(cnpjEmpresa) || "Não encontrado"}</p>
                  </div>
                  <div className="mb-3">
                    <strong>E-mail Administrativo:</strong>
                    <p>{emailEmpresa || "Não encontrado"}</p>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Card para editar o e-mail administrativo */}
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2 text-danger fw-semibold">
                <FaEnvelope size={24} />
                Editar E-mail Administrativo
              </Card.Title>
              <Form.Group controlId="emailAdmin">
                <Form.Label className="mt-2">
                  Novo e-mail administrativo
                </Form.Label>
                <Form.Control
                  type="email"
                  value={emailEmpresaEdicao}
                  onChange={(e) => setEmailEmpresaEdicao(e.target.value)}
                  disabled={editandoEmpresa}
                  placeholder="exemplo@empresa.com.br"
                />
              </Form.Group>
              <Button
                variant="danger"
                className="mt-3 w-100"
                onClick={salvarEmailEmpresa}
                disabled={editandoEmpresa}
              >
                {editandoEmpresa ? "Salvando..." : "Atualizar E-mail"}
              </Button>
              {erroEmpresa && (
                <Alert variant="danger" className="mt-2">
                  {erroEmpresa}
                </Alert>
              )}
              {mensagemEmpresa && (
                <Alert variant="success" className="mt-2">
                  {mensagemEmpresa}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Card para editar o e-mail de cotações */}
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2 text-danger fw-semibold">
                <FaEnvelope size={24} />
                E-mail para Cotações
              </Card.Title>
              <Form.Group controlId="emailCotacoes">
                <Form.Label className="mt-2">
                  E-mail para receber cotações
                </Form.Label>
                <Form.Control
                  type="email"
                  value={emailCotacoes}
                  onChange={(e) => setEmailCotacoes(e.target.value)}
                  placeholder="cotacoes@empresa.com.br"
                />
              </Form.Group>
              <Button
                variant="danger"
                className="mt-3 w-100"
                onClick={salvarEmailCotacoes}
              >
                Salvar E-mail
              </Button>
              {erroCotacoes && (
                <Alert variant="danger" className="mt-2">
                  {erroCotacoes}
                </Alert>
              )}
              {mensagemCotacoes && (
                <Alert variant="success" className="mt-2">
                  {mensagemCotacoes}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Cards de navegação */}
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
            icon={FaBookOpen}
            title="Catálogo"
            description="Atualize o catálogo de controladores disponível para os clientes."
            variant="success"
            onClick={() => navigate("/admin/catalogo")}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PainelAdmin;
