import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  FormControl,
  Button,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // corrigido import

import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "../App.css";
import logo from "../assets/eletrodinamica.png";

const NavBarComp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [nomeUsuario, setNomeUsuario] = useState(null);

  // Decodificar token para pegar nome do usuário
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setNomeUsuario(decoded.nome || "Usuário");
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        setNomeUsuario(null);
      }
    } else {
      setNomeUsuario(null);
    }
  }, [token]);

  // Atualizar token se mudar em outra aba
  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Função logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // Navegar para perfil dependendo do role
  const handlePerfilClick = () => {
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role || decoded.tipo;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "cliente") {
        navigate("/cliente");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Token inválido:", err);
      navigate("/login");
    }
  };

  // Buscar categorias da API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/categorias`
        );
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // Evita mostrar navbar na página de login (ajuste se precisar em outras páginas)
  if (location.pathname === "/login") return null;

  // Verifica se a rota ativa corresponde a alguma categoria para marcar active no dropdown
  const isProductsActive = categorias.some(
    (cat) =>
      location.pathname === `/categoria/${cat.slug}` ||
      location.pathname.startsWith(`/categoria/${cat.slug}/`)
  );

  // Contagem de itens do carrinho (substituir com estado real depois)
  const cartItemCount = 3;

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto align-items-center gap-3">
            <Nav.Link as={NavLink} to="/">
              Início
            </Nav.Link>

            <NavDropdown
              title="Produtos"
              id="navbarDropdown"
              className={isProductsActive ? "active" : ""}
            >
              {categorias.length === 0 ? (
                <NavDropdown.Item disabled>Carregando...</NavDropdown.Item>
              ) : (
                categorias.map((categoria) => (
                  <NavDropdown.Item
                    key={categoria.id}
                    as={NavLink}
                    to={`/categoria/${categoria.slug}`}
                    end
                  >
                    {categoria.nome}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>

            <Nav.Link
              href="http://localhost:3001/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sobre
            </Nav.Link>

            {token ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="dropdown-user"
                  className="icon-hover"
                >
                  <FaUserCircle size={20} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>{nomeUsuario}</Dropdown.Header>
                  <Dropdown.Item onClick={handlePerfilClick}>
                    Minha Conta
                  </Dropdown.Item>

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link onClick={handlePerfilClick} className="icon-hover">
                <FaUserCircle size={20} />
              </Nav.Link>
            )}

            <Nav.Link
              as={NavLink}
              to="/carrinho"
              className="icon-hover position-relative"
            >
              <FaShoppingCart size={20} />
              <Badge
                bg="dark"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {cartItemCount}
              </Badge>
            </Nav.Link>
          </Nav>

          <Form
            className="d-flex ms-auto mt-2 mt-lg-0"
            style={{ gap: "0.5rem" }}
          >
            <FormControl
              type="search"
              placeholder="Pesquisar"
              aria-label="Search"
            />
            <Button className="btn-pesquisar" variant="outline-light">
              Pesquisar
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarComp;
