require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

// Rotas
const configRoutes = require("./routes/configRoutes");
const catalogoRoutes = require("./routes/catalogo");
const produtoRoutes = require("./routes/produtos");
const categoriaRoutes = require("./routes/categoria");
const usuarioRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const cotacaoRoutes = require("./routes/cotacoes");

const app = express();

// URLs permitidas
const ALLOWED_ORIGINS = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["https://loja-olive.vercel.app", "https://site-eight-ruby.vercel.app"];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Helmet (segurança)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permite imagens de outro domínio
    crossOriginEmbedderPolicy: false, // Evita conflitos com assets externos
    contentSecurityPolicy: false, // Desativa CSP para evitar bloqueios no Vercel
  })
);

// Limite de requisições
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos da pasta uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    },
  })
);

// Rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/cotacoes", cotacaoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("API da Eletrodinâmica está rodando");
});

// Conectar ao banco de dados
sequelize
  .authenticate()
  .then(() => console.log("Banco de dados conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

module.exports = app;
