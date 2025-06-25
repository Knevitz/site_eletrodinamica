import React, { useEffect, useState } from "react";
import { Container, Table, Alert, Spinner } from "react-bootstrap";
import api from "../services/axios";

const CategoriasPublicas = () => {
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const res = await api.get("/api/categorias");
        setCategorias(res.data);
        setErro(null);
      } catch (err) {
        setErro("Erro ao carregar categorias.");
      } finally {
        setCarregando(false);
      }
    };

    carregarCategorias();
  }, []);

  if (carregando) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Categorias</h2>
      {erro && <Alert variant="danger">{erro}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                Nenhuma categoria cadastrada.
              </td>
            </tr>
          ) : (
            categorias.map(({ id, nome, slug }) => (
              <tr key={id}>
                <td>{nome}</td>
                <td>{slug}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CategoriasPublicas;
