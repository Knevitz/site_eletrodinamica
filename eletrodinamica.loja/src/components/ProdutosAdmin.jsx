import React, { useEffect, useState, useCallback } from "react";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProdutosAdmin = () => {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/produtos/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data = await res.json();
      setProdutos(data);
      setErro(null);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar produtos.");
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/produtos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      setMensagem("Produto excluído com sucesso.");
      carregarProdutos();
    } catch {
      setErro("Erro ao excluir produto.");
    }
  };

  const toggleAtivo = async (id, ativoAtual) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/produtos/${id}`,
        {
          method: "PATCH", // mudar de PUT para PATCH
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ativo: !ativoAtual }),
        }
      );
      if (!res.ok) throw new Error();
      setMensagem("Visibilidade atualizada.");
      carregarProdutos();
    } catch {
      setErro("Erro ao atualizar visibilidade.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gerenciar Produtos</h2>

      <Button
        variant="danger"
        className="mb-3"
        onClick={() => navigate("/admin/produtos/novo")}
      >
        Adicionar Produto
      </Button>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {mensagem && <Alert variant="success">{mensagem}</Alert>}

      {carregando ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Visível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{produto.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/admin/produtos/${produto.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(produto.id)}
                    >
                      Excluir
                    </Button>
                    <Button
                      variant={produto.ativo ? "secondary" : "success"}
                      size="sm"
                      onClick={() => toggleAtivo(produto.id, produto.ativo)}
                    >
                      {produto.ativo ? "Ocultar" : "Ativar"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProdutosAdmin;
