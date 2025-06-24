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

const ProdutoForm = ({ modo }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [codigoPadrao, setCodigoPadrao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Opções do produto: objeto { opcao: [valores] }
  const [opcoesSelect, setOpcoesSelect] = useState({});
  // Combinações com códigos: array de { opcoes: { opcao1: valor1, ... }, codigo }
  const [codigosPorOpcao, setCodigosPorOpcao] = useState([]);

  const [novaOpcao, setNovaOpcao] = useState("");
  // Estado para armazenar o valor de input para cada opção individualmente
  const [novosValores, setNovosValores] = useState({});

  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const token = localStorage.getItem("token");

  // Função para gerar todas as combinações possíveis (produto cartesiano das opções)
  const gerarCombinacoes = () => {
    const chaves = Object.keys(opcoesSelect);
    if (chaves.length === 0) return [];

    const combinar = (index = 0) => {
      if (index === chaves.length) return [{}];
      const combinacoesRest = combinar(index + 1);
      const chaveAtual = chaves[index];
      const valores = opcoesSelect[chaveAtual] || [];

      const resultado = [];
      for (const valor of valores) {
        for (const combinacao of combinacoesRest) {
          resultado.push({ [chaveAtual]: valor, ...combinacao });
        }
      }
      return resultado;
    };

    return combinar();
  };

  // Atualiza codigosPorOpcao sempre que opcoesSelect mudar, mantendo códigos já digitados
  useEffect(() => {
    const combinacoes = gerarCombinacoes();
    const novosCodigos = combinacoes.map((combinacao) => {
      const encontrado = codigosPorOpcao.find(
        (c) => JSON.stringify(c.opcoes) === JSON.stringify(combinacao)
      );
      return encontrado ? encontrado : { opcoes: combinacao, codigo: "" };
    });
    setCodigosPorOpcao(novosCodigos);
  }, [opcoesSelect]);

  useEffect(() => {
    // Buscar categorias
    fetch(`${process.env.REACT_APP_API_URL}/api/categorias`)
      .then((res) => res.json())
      .then(setCategorias);

    // Se modo editar, buscar produto e preencher estados
    if (modo === "editar") {
      fetch(`${process.env.REACT_APP_API_URL}/api/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome);
          setDescricao(data.descricao);
          setCategoriaId(data.categoriaId);
          setCodigoPadrao(data.codigoPadrao || "");
          setAtivo(data.ativo);
          setOpcoesSelect(data.opcoesSelect || {});
          setCodigosPorOpcao(data.codigosPorOpcao || []);
        })
        .catch(() => {
          setErro("Erro ao carregar dados do produto.");
        });
    }
  }, [modo, id]);

  // Adiciona nova opção (ex: "Caixa")
  const adicionarOpcao = () => {
    const opcaoTrim = novaOpcao.trim();
    if (!opcaoTrim) return;
    if (opcoesSelect[opcaoTrim]) {
      alert("Opção já existe");
      return;
    }
    setOpcoesSelect({ ...opcoesSelect, [opcaoTrim]: [] });
    setNovaOpcao("");
  };

  // Adiciona novo valor em uma opção específica (ex: "220V" em "Tensão")
  const adicionarValor = (opcao) => {
    const valorTrim = (novosValores[opcao] || "").trim();
    if (!valorTrim) return;
    if (opcoesSelect[opcao].includes(valorTrim)) {
      alert("Valor já existe");
      return;
    }
    setOpcoesSelect({
      ...opcoesSelect,
      [opcao]: [...opcoesSelect[opcao], valorTrim],
    });
    setNovosValores({ ...novosValores, [opcao]: "" });
  };

  // Remove valor da opção
  const removerValor = (opcao, valor) => {
    setOpcoesSelect({
      ...opcoesSelect,
      [opcao]: opcoesSelect[opcao].filter((v) => v !== valor),
    });
  };

  // Altera código de uma combinação específica
  const alterarCodigo = (index, novoCodigo) => {
    const atualizados = [...codigosPorOpcao];
    atualizados[index].codigo = novoCodigo;
    setCodigosPorOpcao(atualizados);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    if (!nome || !descricao || !categoriaId) {
      return setErro("Todos os campos principais são obrigatórios.");
    }

    if (!codigoPadrao && codigosPorOpcao.length === 0) {
      return setErro(
        "Informe um código padrão ou pelo menos um código por opção."
      );
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("categoriaId", categoriaId);
    formData.append("codigoPadrao", codigoPadrao);
    formData.append("ativo", ativo);
    formData.append("opcoesSelect", JSON.stringify(opcoesSelect));
    formData.append("codigosPorOpcao", JSON.stringify(codigosPorOpcao));

    if (imagem) formData.append("imagem", imagem);
    if (pdf) formData.append("pdf", pdf);

    const endpoint =
      modo === "editar"
        ? `${process.env.REACT_APP_API_URL}/api/produtos/${id}`
        : `${process.env.REACT_APP_API_URL}/api/produtos`;
    const method = modo === "editar" ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setMensagem("Produto salvo com sucesso.");
      setTimeout(() => navigate("/admin/produtos"), 1500);
    } else {
      const data = await res.json();
      setErro(data.erro || "Erro ao salvar produto.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>{modo === "editar" ? "Editar Produto" : "Novo Produto"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Selecione</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Código padrão</Form.Label>
          <Form.Control
            value={codigoPadrao}
            onChange={(e) => setCodigoPadrao(e.target.value)}
          />
          <Form.Text className="text-muted">
            Informe um código padrão se não houver códigos por opção.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ativo</Form.Label>
          <Form.Check
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            label="Produto ativo para exibição"
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Label>Imagem</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImagem(e.target.files[0])}
            />
          </Col>
          <Col>
            <Form.Label>PDF (manual)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setPdf(e.target.files[0])}
            />
          </Col>
        </Row>

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

        {/* Para cada opção, mostra os valores e campo para adicionar valor */}
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
                  disabled={
                    !novosValores[opcao] || novosValores[opcao].trim() === ""
                  }
                >
                  +
                </Button>
              </Col>
            </Row>
          </div>
        ))}

        <hr />

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
            {codigosPorOpcao.length === 0 && (
              <tr>
                <td
                  colSpan={Object.keys(opcoesSelect).length + 1}
                  className="text-center"
                >
                  Nenhuma combinação
                </td>
              </tr>
            )}
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
