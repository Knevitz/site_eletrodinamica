import "./App.css";
import ScrollToTop from "./components/ScrollTop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FooterComp from "./components/FooterComp";
import { Container } from "react-bootstrap";
import NavBarComp from "./components/NavBarComp";
import Home from "./pages/Home";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import ContaCliente from "./pages/ContaCliente";
import PainelAdmin from "./pages/PainelAdmin";
import ProdutosAdmin from "./components/ProdutosAdmin";
import ClientesAdmin from "./components/ClientesAdmin";
import AtualizarCatalogo from "./components/AtualizarCatalogo";
import Registrar from "./pages/Registrar";

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
            <Route path="/" element={<Home />} />
            <Route path="/Carrinho" element={<Carrinho />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/cliente" element={<ContaCliente />} />
            <Route path="/admin" element={<PainelAdmin />} />
            <Route path="/admin/produtos" element={<ProdutosAdmin />} />
            <Route path="/admin/clientes" element={<ClientesAdmin />} />
            <Route path="/admin/catalogo" element={<AtualizarCatalogo />} />
            {/* Exemplo de página de perfil */}
          </Routes>
        </Container>
      </div>
      {!isLoginPage && <FooterComp />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
