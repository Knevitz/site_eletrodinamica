import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Card,
  Form,
} from "react-bootstrap";
import { formatarCNPJ } from "../components/CNPJ";
import api from "../services/axios";

const ContaCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Estados para edição de email
  const [emailEdit, setEmailEdit] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [erroEdicao, setErroEdicao] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resUsuario, resHistorico] = await Promise.all([
          api.get("/api/usuarios/me"),
          api.get("/api/cotacoes/minhas"),
        ]);

        setCliente(resUsuario.data);
        setHistorico(resHistorico.data);
        setEmailEdit(resUsuario.data.email || "");
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar dados do cliente.");
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, []);

  const salvarEmail = async () => {
    setErroEdicao(null);
    setMensagemSucesso(null);

    if (!/\S+@\S+\.\S+/.test(emailEdit)) {
      setErroEdicao("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      setEditando(true);
      await api.put("/api/usuarios/me", { email: emailEdit });
      setMensagemSucesso("E-mail atualizado com sucesso.");
      setCliente((old) => ({ ...old, email: emailEdit }));
    } catch (err) {
      console.error("Erro ao atualizar e-mail:", err);
      setErroEdicao("Erro ao atualizar o e-mail.");
    } finally {
      setEditando(false);
    }
  };

  if (carregando) {
    return (
      <Container className="mt-5 text-center">
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

  return (
    <Container className="mt-5">
      <h2 className="mb-3">Minha Conta</h2>
      <p>
        <strong>Nome / Razão Social:</strong> {cliente?.nome}
      </p>
      <p>
        <strong>CNPJ:</strong> {formatarCNPJ(cliente?.cnpj)}
      </p>
      <p>
        <strong>Email:</strong> {cliente?.email}
      </p>

      {/* Card para editar email */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Editar E-mail</Card.Title>
          <Form.Control
            type="email"
            placeholder="Digite seu e-mail"
            value={emailEdit}
            onChange={(e) => setEmailEdit(e.target.value)}
            disabled={editando}
          />
          {erroEdicao && (
            <Alert variant="danger" className="mt-2">
              {erroEdicao}
            </Alert>
          )}
          {mensagemSucesso && (
            <Alert variant="success" className="mt-2">
              {mensagemSucesso}
            </Alert>
          )}
          <Button
            className="mt-3"
            variant="danger"
            onClick={salvarEmail}
            disabled={editando}
          >
            {editando ? "Salvando..." : "Salvar E-mail"}
          </Button>
        </Card.Body>
      </Card>

      <h4 className="mt-4">Histórico de Cotações</h4>
      {historico.length === 0 ? (
        <p>Você ainda não enviou nenhuma cotação.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nº</th>
              <th>Data</th>
              <th>Itens</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((cotacao) => (
              <tr key={cotacao.id}>
                <td>{cotacao.id}</td>
                <td>{new Date(cotacao.createdAt).toLocaleDateString()}</td>
                <td>{cotacao.itens.length}</td>
                <td>Enviado</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ContaCliente;
