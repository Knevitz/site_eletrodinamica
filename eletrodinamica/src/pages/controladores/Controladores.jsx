import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import ImagemComTexto from "../../components/ImagemComTexto";
import ControlEletr from "../../assets/prodEletrod.jpg";
import api from "../../services/axios";

const Controladores = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const res = await api.get("/api/produtos/ativos");
        setProdutos(res.data || []);
      } catch (err) {
        setErro("Erro ao carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutos();
  }, []);

  return (
    <div>
      <Container>
        <h1 className="mb-4">Controladores e Relés Industriais</h1>
        <ImagemComTexto
          imagemSrc={ControlEletr}
          altTexto="Controladores e Relés Industriais Eletrodinâmica"
          titulo="Versatilidade e robustez"
          texto1="Os controladores e relés industriais da Eletrodinâmica® são a opção certa para o seu negócio."
          texto2="Fabricação nacional"
        />
        <p className="mb-4">
          Clique abaixo e veja detalhadamente cada produto:
        </p>

        {carregando && <Spinner animation="border" className="mb-3" />}
        {erro && <Alert variant="danger">{erro}</Alert>}

        {produtos.map((produto) => (
          <p key={produto.slug}>
            <a
              href={`https://loja-olive.vercel.app/produto/${produto.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-vermelho"
            >
              {produto.nome}
            </a>
          </p>
        ))}

        <p className="mb-4">
          <strong>Veja abaixo o catálogo Eletrodinâmica&reg;</strong>
        </p>
        <div className="mb-4">
          <Button
            variant="danger"
            href={`${process.env.REACT_APP_API_URL}api/catalogo/arquivo`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir Catálogo PDF
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Controladores;
