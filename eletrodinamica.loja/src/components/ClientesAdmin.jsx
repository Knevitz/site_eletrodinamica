import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Form } from "react-bootstrap";
import CNPJ, { formatarCNPJ } from "../components/CNPJ";

const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarClientes = async () => {
      setCarregando(true);
      setErro(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}api/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar clientes");

        const data = await res.json();
        const apenasClientes = data.filter(
          (usuario) => usuario.tipo === "cliente"
        );
        apenasClientes.sort((a, b) => a.nome.localeCompare(b.nome));
        setClientes(apenasClientes);
      } catch (err) {
        setErro("Não foi possível carregar os clientes.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    buscarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.cnpj.replace(/\D/g, "").includes(filtro.replace(/\D/g, ""))
  );

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Buscar Clientes</h2>

      <Form className="mb-4">
        <Form.Group>
          <CNPJ
            className="form-control"
            value={filtro}
            onChange={(val) => setFiltro(val)}
          />
        </Form.Group>
      </Form>

      {carregando ? (
        <Spinner animation="border" />
      ) : erro ? (
        <Alert variant="danger">{erro}</Alert>
      ) : clientes.length === 0 ? (
        <Alert variant="warning">Não possui cliente.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Nenhum cliente encontrado com esse CNPJ.
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{formatarCNPJ(cliente.cnpj)}</td>
                  <td>{cliente.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ClientesAdmin;
