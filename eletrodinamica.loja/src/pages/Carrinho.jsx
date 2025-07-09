import React from "react";
import { Container, Row, Col, Alert, Button, Form } from "react-bootstrap";
import useCarrinhoStore from "../store/carrinhoStore";
import { useNavigate } from "react-router-dom";

const Carrinho = () => {
  const { itens, remover, limpar, atualizarQuantidade } = useCarrinhoStore();
  const navigate = useNavigate();
  if (itens.length === 0) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Alert variant="warning">
              <h4>Nenhum produto no carrinho</h4>
              <p>O seu carrinho está vazio.</p>
              <Button variant="danger" href="/">
                Voltar à página inicial
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Carrinho</h2>
      {itens.map((item) => (
        <Row key={item.codigo} className="align-items-center mb-3 border p-2">
          <Col md={4}>
            <h5>{item.nome}</h5>
            <p>
              <strong>Código:</strong> {item.codigo}
            </p>
          </Col>
          <Col md={2}>
            <Form.Label>
              <strong>Quantidade</strong>
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={item.quantidade}
              onChange={(e) =>
                atualizarQuantidade(item.codigo, parseInt(e.target.value, 10))
              }
            />
          </Col>
          <Col md={4} className="text-end">
            <Button
              variant="outline-danger"
              onClick={() => remover(item.codigo)}
            >
              Remover
            </Button>
          </Col>
        </Row>
      ))}

      <div className="text-end mt-4 mb-4">
        <Button variant="secondary" onClick={limpar}>
          Limpar Carrinho
        </Button>{" "}
        <Button
          variant="danger"
          onClick={() => navigate("/cliente/confirmar-cotacao")}
        >
          Enviar Cotação
        </Button>
      </div>
    </Container>
  );
};

export default Carrinho;
