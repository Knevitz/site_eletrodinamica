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
import PrivateRoute from "./components/PrivateRoute";

// Páginas públicas
import Home from "./pages/Home";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/login";
import Registrar from "./pages/Registrar";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import CategoriasPublicas from "./pages/CategoriasPublicas";
import ProdutosPorCategoria from "./components/ProdutosPorCategoria";
import BuscaResultados from "./components/BuscaResultados";

// Cliente
import ContaCliente from "./pages/ContaCliente";
import ConfirmarCotacao from "./pages/ConfirmarCotacao";

// Admin
import PainelAdmin from "./pages/PainelAdmin";
import ProdutosAdmin from "./components/ProdutosAdmin";
import ProdutoForm from "./components/ProdutoForm";
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
            <Route path="/categoria/:slug" element={<ProdutosPorCategoria />} />
            <Route path="/produto/:slug" element={<ProdutoDetalhe />} />
            <Route path="/buscar" element={<BuscaResultados />} />

            {/* Cliente (rota protegida) */}
            <Route
              path="/cliente"
              element={<PrivateRoute allowedRoles={["cliente"]} />}
            >
              <Route index element={<ContaCliente />} />
              <Route path="confirmar-cotacao" element={<ConfirmarCotacao />} />
            </Route>

            {/* Admin (rota protegida) */}
            <Route
              path="/admin"
              element={<PrivateRoute allowedRoles={["admin"]} />}
            >
              <Route index element={<PainelAdmin />} />
              {/* Categorias */}
              <Route path="categorias" element={<CategoriasAdmin />} />
              <Route path="categorias/novo" element={<CategoriaCriar />} />
              <Route path="categorias/:id" element={<CategoriaEditar />} />
              {/* Produtos */}
              <Route path="produtos" element={<ProdutosAdmin />} />
              <Route
                path="produtos/novo"
                element={<ProdutoForm modo="criar" />}
              />
              <Route
                path="produtos/:id"
                element={<ProdutoForm modo="editar" />}
              />
              {/* Clientes */}
              <Route path="clientes" element={<ClientesAdmin />} />
              {/* Catálogo */}
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
