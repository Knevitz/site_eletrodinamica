require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

const configRoutes = require("./routes/configRoutes");
const catalogoRoutes = require("./routes/catalogo");
const produtoRoutes = require("./routes/produtos");
const categoriaRoutes = require("./routes/categoria");
const usuarioRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", FRONTEND_URL],
        styleSrc: ["'self'", "'unsafe-inline'", FRONTEND_URL],
        imgSrc: ["'self'", FRONTEND_URL, "data:", "blob:"],
        connectSrc: ["'self'", FRONTEND_URL],
        fontSrc: ["'self'", FRONTEND_URL],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens e PDFs)
// O cabeçalho Cross-Origin-Resource-Policy é essencial para liberar acesso ao frontend
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    },
  })
);

// Rate limiting para evitar ataques de força bruta
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);

app.get("/", (req, res) => {
  res.send("API da Eletrodinâmica está rodando");
});

// Conexão com banco e exportação do app
sequelize
  .authenticate()
  .then(() => console.log("Banco de dados conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

module.exports = app;
