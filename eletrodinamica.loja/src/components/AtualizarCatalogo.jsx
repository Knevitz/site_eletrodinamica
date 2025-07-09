import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const AtualizarCatalogo = () => {
  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErro(null);
    setSucesso(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!file) {
      setErro("Por favor, selecione um arquivo PDF antes de enviar.");
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append("catalogo", file);

      const token = localStorage.getItem("token");
      if (!token) {
        setErro("Usuário não autenticado. Faça login novamente.");
        setEnviando(false);
        return;
      }

      const resposta = await fetch(
        `${process.env.REACT_APP_API_URL}api/catalogo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!resposta.ok) {
        const json = await resposta.json();
        throw new Error(json.erro || "Erro ao enviar catálogo.");
      }

      setSucesso("Catálogo enviado com sucesso!");
      setFile(null);
      e.target.reset(); // limpa o input file
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4">Atualizar Catálogo de Produtos</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}

      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Selecionar novo PDF</Form.Label>
          <Form.Control
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={enviando}
          />
        </Form.Group>
        <Button variant="danger" type="submit" disabled={enviando}>
          {enviando ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default AtualizarCatalogo;
