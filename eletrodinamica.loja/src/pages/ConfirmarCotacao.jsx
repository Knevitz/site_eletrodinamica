import React from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import useCarrinhoStore from "../store/carrinhoStore";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ConfirmarCotacao = () => {
  const { itens, limpar } = useCarrinhoStore();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para confirmar a cotação.");
    navigate("/login");
    return null;
  }

  let email = "Email não encontrado";

  try {
    const decoded = jwtDecode(token);
    email = decoded.email || email;
  } catch {
    alert("Sessão inválida. Faça login novamente.");
    navigate("/login");
    return null;
  }

  if (itens.length === 0) {
    return (
      <Container className="mt-5 mb-5">
        <Alert variant="warning">
          Seu carrinho está vazio.{" "}
          <Button variant="secondary" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleConfirmar = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/cotacoes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itens }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.erro || "Erro ao enviar cotação.");
      }

      alert("Cotação enviada com sucesso!");
      limpar();
      navigate("/");
    } catch (error) {
      console.error("Erro ao confirmar cotação:", error);
      alert("Erro: " + error.message);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2>Confirmar Cotação</h2>

      <Alert
        variant="info"
        className="d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>Email para envio:</strong> {email}
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate("/cliente")}
        >
          Editar Email
        </Button>
      </Alert>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Código</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.codigo}>
              <td>
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.imagem}`}
                  alt={item.nome}
                  style={{ width: "80px" }}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.codigo}</td>
              <td>{item.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-end mt-4">
        <Button variant="success" onClick={handleConfirmar}>
          Confirmar Cotação
        </Button>
      </div>
    </Container>
  );
};

export default ConfirmarCotacao;
