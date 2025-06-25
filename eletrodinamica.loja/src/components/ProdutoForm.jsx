import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { gerarCombinacoes } from "./geradorCodigos";

const ProdutoForm = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados principais do produto
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Códigos: padrão ou por opção
  const [modoCodigo, setModoCodigo] = useState("padrao"); // "padrao" ou "porOpcao"
  const [codigoPadrao, setCodigoPadrao] = useState("");

  // Opções para código por opção
  const [opcoesSelect, setOpcoesSelect] = useState({});
  const [novaOpcao, setNovaOpcao] = useState("");
  const [novosValores, setNovosValores] = useState({});
  const [codigosPorOpcao, setCodigosPorOpcao] = useState([]);

  // Mensagens
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const token = localStorage.getItem("token");

  // Carregar categorias e produto se modo editar
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/categorias`)
      .then((res) => res.json())
      .then(setCategorias)
      .catch(() => setErro("Erro ao carregar categorias."));

    if (modo === "editar") {
      fetch(`${process.env.REACT_APP_API_URL}/api/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome);
          setDescricao(data.descricao);
          setCategoriaId(data.categoriaId);
          setAtivo(data.ativo);
          if (data.codigoPadrao) {
            setModoCodigo("padrao");
            setCodigoPadrao(data.codigoPadrao);
          } else {
            setModoCodigo("porOpcao");
          }
          setOpcoesSelect(data.opcoesSelect || {});
          setCodigosPorOpcao(data.codigosPorOpcao || []);
          if (data.imagem) setImagem(data.imagem);
        })
        .catch(() => setErro("Erro ao carregar dados do produto."));
    }
  }, [modo, id, token]);

  // Adicionar nova opção
  const adicionarOpcao = () => {
    const opcao = novaOpcao.trim();
    if (!opcao) {
      alert("Informe o nome da opção.");
      return;
    }
    if (opcoesSelect[opcao]) {
      alert("Opção já existe.");
      return;
    }
    setOpcoesSelect({ ...opcoesSelect, [opcao]: [] });
    setNovaOpcao("");
  };

  // Adicionar valor a uma opção
  const adicionarValor = (opcao) => {
    const valor = (novosValores[opcao] || "").trim();
    if (!valor) {
      alert("Informe o valor.");
      return;
    }
    if (opcoesSelect[opcao].includes(valor)) {
      alert("Valor já existe.");
      return;
    }
    setOpcoesSelect({
      ...opcoesSelect,
      [opcao]: [...opcoesSelect[opcao], valor],
    });
    setNovosValores({ ...novosValores, [opcao]: "" });
  };

  // Remover valor de uma opção
  const removerValor = (opcao, valor) => {
    setOpcoesSelect({
      ...opcoesSelect,
      [opcao]: opcoesSelect[opcao].filter((v) => v !== valor),
    });
  };

  // Gerar combinações e códigos por opção
  const gerarCodigos = () => {
    const combinacoes = gerarCombinacoes(opcoesSelect);
    const novosCodigos = combinacoes.map((opcoes) => {
      // tenta reutilizar código existente se combinação igual
      const existente = codigosPorOpcao.find(
        (c) => JSON.stringify(c.opcoes) === JSON.stringify(opcoes)
      );
      return existente || { opcoes, codigo: "" };
    });
    setCodigosPorOpcao(novosCodigos);
  };

  // Alterar código de uma combinação
  const alterarCodigo = (index, novoCodigo) => {
    const atualizados = [...codigosPorOpcao];
    atualizados[index] = { ...atualizados[index], codigo: novoCodigo };
    setCodigosPorOpcao(atualizados);
  };

  // Manipular mudança de arquivos (imagem e pdf)
  const handleFileChange = (setter, e) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    // Validações básicas
    if (!nome.trim() || !descricao.trim() || !categoriaId) {
      setErro("Nome, descrição e categoria são obrigatórios.");
      return;
    }

    if (modoCodigo === "padrao") {
      if (!codigoPadrao.trim()) {
        setErro("Informe o código padrão.");
        return;
      }
    } else {
      if (codigosPorOpcao.length === 0) {
        setErro("Gere as combinações e informe os códigos por opção.");
        return;
      }
      // Validar se todos códigos não estão vazios
      const temCodigoVazio = codigosPorOpcao.some(
        (item) => !item.codigo.trim()
      );
      if (temCodigoVazio) {
        setErro("Preencha todos os códigos das combinações.");
        return;
      }
    }

    // Prepara form data
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("categoriaId", categoriaId);
    formData.append("ativo", ativo);
    formData.append("modoCodigo", modoCodigo);
    formData.append(
      "codigoPadrao",
      modoCodigo === "padrao" ? codigoPadrao : ""
    );
    formData.append("opcoesSelect", JSON.stringify(opcoesSelect));
    formData.append("codigosPorOpcao", JSON.stringify(codigosPorOpcao));

    if (imagem && typeof imagem !== "string") {
      formData.append("imagem", imagem);
    }
    if (pdf && typeof pdf !== "string") {
      formData.append("pdf", pdf);
    }

    const endpoint =
      modo === "editar"
        ? `${process.env.REACT_APP_API_URL}/api/produtos/${id}`
        : `${process.env.REACT_APP_API_URL}/api/produtos`;

    try {
      const res = await fetch(endpoint, {
        method: modo === "editar" ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || "Erro ao salvar produto.");
      }

      setMensagem("Produto salvo com sucesso.");
      setTimeout(() => navigate("/admin/produtos"), 1500);
    } catch (err) {
      setErro(err.message || "Erro na comunicação com o servidor.");
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2>{modo === "editar" ? "Editar Produto" : "Novo Produto"}</h2>
      <Form onSubmit={handleSubmit}>
        {/* Campos principais */}
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Uploads */}
        <Row className="mb-3">
          <Col>
            <Form.Label>Imagem</Form.Label>
            {modo === "editar" && imagem && typeof imagem === "string" && (
              <div className="mb-2">
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${imagem}`}
                  alt="Imagem atual"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              onChange={(e) => handleFileChange(setImagem, e)}
            />
          </Col>
          <Col>
            <Form.Label>PDF (manual)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleFileChange(setPdf, e)}
            />
          </Col>
        </Row>

        {/* Escolha do tipo de código */}
        <Form.Group className="mb-3">
          <Form.Label>Tipo de Código</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="Código Padrão"
              name="modoCodigo"
              id="padrao"
              checked={modoCodigo === "padrao"}
              onChange={() => setModoCodigo("padrao")}
            />
            <Form.Check
              inline
              type="radio"
              label="Código por Opção"
              name="modoCodigo"
              id="porOpcao"
              checked={modoCodigo === "porOpcao"}
              onChange={() => setModoCodigo("porOpcao")}
            />
          </div>
        </Form.Group>

        {/* Código padrão */}
        {modoCodigo === "padrao" && (
          <Form.Group className="mb-3">
            <Form.Label>Código padrão</Form.Label>
            <Form.Control
              value={codigoPadrao}
              onChange={(e) => setCodigoPadrao(e.target.value)}
              required={modoCodigo === "padrao"}
            />
          </Form.Group>
        )}

        {/* Código por opção */}
        {modoCodigo === "porOpcao" && (
          <>
            <hr />
            <h5>Opções do Produto</h5>
            <Row className="mb-2">
              <Col md={6}>
                <Form.Control
                  placeholder="Nova opção (ex: Caixa, Tensão, Cor)"
                  value={novaOpcao}
                  onChange={(e) => setNovaOpcao(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button variant="secondary" onClick={adicionarOpcao}>
                  Adicionar Opção
                </Button>
              </Col>
            </Row>

            {Object.entries(opcoesSelect).map(([opcao, valores]) => (
              <div key={opcao} style={{ marginBottom: "1rem" }}>
                <strong>{opcao}</strong>
                <div>
                  {valores.map((valor) => (
                    <span
                      key={valor}
                      style={{
                        marginRight: "10px",
                        padding: "3px 8px",
                        backgroundColor: "#ddd",
                        borderRadius: "12px",
                        display: "inline-block",
                      }}
                    >
                      {valor}{" "}
                      <button
                        type="button"
                        onClick={() => removerValor(opcao, valor)}
                        style={{
                          marginLeft: "5px",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "red",
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <Row className="mt-1" style={{ maxWidth: "300px" }}>
                  <Col xs={8}>
                    <Form.Control
                      placeholder={`Novo valor para ${opcao}`}
                      value={novosValores[opcao] || ""}
                      onChange={(e) =>
                        setNovosValores({
                          ...novosValores,
                          [opcao]: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col xs={4}>
                    <Button
                      variant="secondary"
                      onClick={() => adicionarValor(opcao)}
                      disabled={!novosValores[opcao]?.trim()}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="mb-4">
              <Button variant="primary" onClick={gerarCodigos}>
                Gerar Combinações
              </Button>
            </div>

            {codigosPorOpcao.length > 0 && (
              <>
                <h5>Combinações e Códigos</h5>
                <Table bordered>
                  <thead>
                    <tr>
                      {Object.keys(opcoesSelect).map((opcao) => (
                        <th key={opcao}>{opcao}</th>
                      ))}
                      <th>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codigosPorOpcao.map((item, i) => (
                      <tr key={i}>
                        {Object.keys(opcoesSelect).map((opcao, idx) => (
                          <td key={idx}>{item.opcoes[opcao]}</td>
                        ))}
                        <td>
                          <Form.Control
                            value={item.codigo}
                            onChange={(e) => alterarCodigo(i, e.target.value)}
                            placeholder="Código"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </>
        )}

        {/* Mensagens */}
        {erro && <Alert variant="danger">{erro}</Alert>}
        {mensagem && <Alert variant="success">{mensagem}</Alert>}

        <Button type="submit" variant="danger">
          Salvar Produto
        </Button>
      </Form>
    </Container>
  );
};

export default ProdutoForm;
