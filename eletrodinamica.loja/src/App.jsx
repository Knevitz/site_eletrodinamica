import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import ScrollToTop from "./components/ScrollTop";
import NavBarComp from "./components/NavBarComp";
import FooterComp from "./components/FooterComp";

// Páginas públicas
import Home from "./pages/Home";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Registrar from "./pages/Registrar";
import CategoriasPublicas from "./pages/CategoriasPublicas";

// Cliente
import ContaCliente from "./pages/ContaCliente";

// Admin
import PrivateRoute from "./components/PrivateRoute";
import PainelAdmin from "./pages/PainelAdmin";
import ProdutosAdmin from "./components/ProdutosAdmin";
import ClientesAdmin from "./components/ClientesAdmin";
import AtualizarCatalogo from "./components/AtualizarCatalogo";
import CategoriasAdmin from "./pages/CategoriasAdmin";
import CategoriaCriar from "./pages/CategoriaCriar";
import CategoriaEditar from "./pages/CategoriaEditar";

const AppContent = () => {
  const location = useLocation();

  const isLoginPage =
    ["/login", "/registrar", "/recuperar-senha"].includes(location.pathname) ||
    location.pathname.startsWith("/redefinir-senha");

  return (
    <>
      {!isLoginPage && <NavBarComp />}
      <div className="app-content">
        <Container className={!isLoginPage ? "mt-5" : ""}>
          <ScrollToTop />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/categorias" element={<CategoriasPublicas />} />

            {/* Rotas protegidas - cliente */}
            <Route
              path="/cliente"
              element={<PrivateRoute allowedRoles={["cliente"]} />}
            >
              <Route index element={<ContaCliente />} />
            </Route>

            {/* Rotas protegidas - admin */}
            <Route
              path="/admin"
              element={<PrivateRoute allowedRoles={["admin"]} />}
            >
              <Route index element={<PainelAdmin />} />

              {/* ROTAS DE CATEGORIA - ordem importa */}
              <Route path="categorias" element={<CategoriasAdmin />} />
              <Route path="categorias/novo" element={<CategoriaCriar />} />
              <Route path="categorias/:id" element={<CategoriaEditar />} />

              <Route path="produtos" element={<ProdutosAdmin />} />
              <Route path="clientes" element={<ClientesAdmin />} />
              <Route path="catalogo" element={<AtualizarCatalogo />} />
            </Route>
          </Routes>
        </Container>
      </div>
      {!isLoginPage && <FooterComp />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
