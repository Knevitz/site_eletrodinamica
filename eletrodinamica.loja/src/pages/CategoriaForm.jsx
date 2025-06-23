import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const CategoriaForm = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(modo === "editar");

  const token = localStorage.getItem("token");

  // Carregar dados da categoria se for modo de edição
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/categorias/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Erro ao carregar categoria");

        const data = await res.json();
        setNome(data.nome || "");
        setCarregando(false);
      } catch (err) {
        setErro("Erro ao carregar dados da categoria.");
        setCarregando(false);
      }
    };

    if (modo === "editar") fetchCategoria();
  }, [id, modo, token]);

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    if (!nome.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }

    try {
      const endpoint =
        modo === "editar"
          ? `${process.env.REACT_APP_API_URL}/api/categorias/${id}`
          : `${process.env.REACT_APP_API_URL}/api/categorias`;

      const metodo = modo === "editar" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome }),
      });

      if (!res.ok) throw new Error("Erro ao salvar categoria");

      setMensagem("Categoria salva com sucesso.");
      setTimeout(() => navigate("/admin/categorias"), 1500);
    } catch {
      setErro("Erro ao salvar categoria.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">
        {modo === "editar" ? "Editar Categoria" : "Nova Categoria"}
      </h2>

      {carregando ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome da Categoria</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Controladores"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>

          {erro && <Alert variant="danger">{erro}</Alert>}
          {mensagem && <Alert variant="success">{mensagem}</Alert>}

          <Button variant="danger" type="submit">
            {modo === "editar" ? "Salvar Alterações" : "Criar Categoria"}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default CategoriaForm;
