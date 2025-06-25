import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatarCNPJ } from "../components/CNPJ";
import api from "../services/axios";

const ContaCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resUsuario, resHistorico] = await Promise.all([
          api.get("/api/usuarios/me"),
          api.get("/api/cotacoes/minhas"),
        ]);

        setCliente(resUsuario.data);
        setHistorico(resHistorico.data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar dados do cliente.");
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, []);

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

      <Button
        variant="outline-danger"
        className="mb-4"
        onClick={() => navigate("/cliente/editar")}
      >
        Editar Dados
      </Button>

      <h4 className="mt-4">Histórico de Cotações</h4>
      {historico.length === 0 ? (
        <p>Você ainda não enviou nenhuma cotação.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
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
