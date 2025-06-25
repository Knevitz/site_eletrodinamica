import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

const CategoriasAdmin = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const carregarCategorias = async () => {
    try {
      const res = await api.get("/api/categorias");
      setCategorias(res.data);
      setErro(null);
    } catch (error) {
      setErro("Erro ao carregar categorias.");
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirma a exclusão desta categoria?")) return;

    try {
      await api.delete(`/api/categorias/${id}`);
      setMensagem("Categoria deletada com sucesso.");
      carregarCategorias();
    } catch {
      setErro("Erro ao deletar categoria.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gerenciar Categorias</h2>
      <Button
        variant="danger"
        className="mb-3"
        onClick={() => navigate("/admin/categorias/novo")}
      >
        Adicionar Categoria
      </Button>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {mensagem && <Alert variant="success">{mensagem}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                Nenhuma categoria cadastrada.
              </td>
            </tr>
          ) : (
            categorias.map(({ id, nome, slug }) => (
              <tr key={id}>
                <td>{nome}</td>
                <td>{slug}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/categorias/${id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CategoriasAdmin;
