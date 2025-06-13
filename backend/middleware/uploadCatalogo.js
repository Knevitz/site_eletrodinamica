const multer = require("multer");
const path = require("path");
const fs = require("fs");

const pastaCatalogo = path.join(__dirname, "..", "uploads", "catalogo");

// Cria a pasta se não existir
if (!fs.existsSync(pastaCatalogo)) {
  fs.mkdirSync(pastaCatalogo, { recursive: true });
}

const storage = multer.diskStorage({
  destination: pastaCatalogo,
  filename: (req, file, cb) => {
    // Usa nome temporário como nos manuais
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Apenas arquivos PDF são permitidos"), false);
};

module.exports = multer({ storage, fileFilter });
