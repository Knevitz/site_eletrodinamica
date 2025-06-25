import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../services/axios";

const Empresa = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await api.get("/api/config/empresa");
        setEmail(res.data.email || "");
      } catch {
        setErro("Não foi possível carregar os dados da empresa.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const salvar = async () => {
    setErro(null);
    setMensagem(null);
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await api.put("/api/config/empresa", { email });
      setMensagem("Informações atualizadas com sucesso.");
    } catch {
      setErro("Erro ao atualizar as informações.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-danger fw-bold">Informações da Empresa</h2>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Email Principal da Empresa</Form.Label>
            <Form.Control
              type="email"
              placeholder="exemplo@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant="danger" onClick={salvar}>
            Salvar Alterações
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
    </Container>
  );
};

export default Empresa;
