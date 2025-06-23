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
import { jwtDecode } from "jwt-decode";

import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "../App.css";
import logo from "../assets/eletrodinamica.png";

const NavBarComp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  // Estado para token e nome do usuário
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [nomeUsuario, setNomeUsuario] = useState(null);

  // Atualiza nome do usuário quando token muda
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setNomeUsuario(decoded.nome || "Usuário");
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        setNomeUsuario(null);
      }
    } else {
      setNomeUsuario(null);
    }
  }, [token]);

  // Atualiza token no estado se mudar localStorage (outras abas)
  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Função para logout limpa token e redireciona
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handlePerfilClick = () => {
    if (!token) {
      return navigate("/login");
    }
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
    } catch (error) {
      console.error("Token inválido:", error);
      navigate("/login");
    }
  };

  // Fetch categorias (mock)
  useEffect(() => {
    async function fetchCategorias() {
      const data = [
        { id: 1, nome: "Relés de estado sólido", slug: "EstadoSolido" },
        {
          id: 2,
          nome: "Controladores e relés industriais",
          slug: "controladores",
        },
        { id: 3, nome: "Temporizador digital", slug: "TemporizadorDigital" },
      ];
      setCategorias(data);
    }
    fetchCategorias();
  }, []);

  if (location.pathname === "/login") return null;

  const isProductsActive = categorias.some((cat) =>
    location.pathname.startsWith(`/${cat.slug}`)
  );

  const cartItemCount = 3; // Pode substituir por Zustand ou outro estado

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
              {categorias.map((categoria) => (
                <NavDropdown.Item
                  key={categoria.id}
                  as={NavLink}
                  to={`/${categoria.slug}`}
                >
                  {categoria.nome}
                </NavDropdown.Item>
              ))}
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
