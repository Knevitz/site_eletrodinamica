import "./App.css";
import ScrollToTop from "./components/ScrollTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FooterComp from "./components/FooterComp";
import { Container } from "react-bootstrap";
import NavBarComp from "./components/NavBarComp";
import Home from "./pages/Home";
import Paineis from "./pages/Paineis";
import Controladores from "./pages//controladores/Controladores";
import Venda from "./pages/Venda";
import Rebobinagem from "./pages/Rebobinagem";
import Estufas from "./pages/Estufas";

const App = () => {
  return (
    <Router>
      <div className="app-content">
        <NavBarComp />
        <Container className="mt-5">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paineis" element={<Paineis />} />
            <Route path="/controladores" element={<Controladores />} />
            <Route path="/venda" element={<Venda />} />
            <Route path="/rebobinagem" element={<Rebobinagem />} />
            <Route path="/estufas" element={<Estufas />} />
          </Routes>
        </Container>
      </div>
      <FooterComp />
    </Router>
  );
};

export default App;
