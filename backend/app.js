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
const cotacaoRoutes = require("./routes/cotacoes");

const app = express();

const ALLOWED_ORIGINS = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:3001", "http://localhost:3002"];

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

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", ...ALLOWED_ORIGINS],
        scriptSrc: ["'self'", "'unsafe-inline'", ...ALLOWED_ORIGINS],
        styleSrc: ["'self'", "'unsafe-inline'", ...ALLOWED_ORIGINS],
        imgSrc: ["'self'", "data:", "blob:", ...ALLOWED_ORIGINS],
        connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
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

app.get("/", (req, res) => {
  res.send("API da Eletrodinâmica está rodando");
});

sequelize
  .authenticate()
  .then(() => console.log("Banco de dados conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

module.exports = app;
