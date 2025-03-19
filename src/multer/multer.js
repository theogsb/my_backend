import multer from "multer";
import path from "path";
import fs from "fs";

// Usando __dirname diretamente
const __dirname = path.resolve();

// Diretórios
const defaultUsersDirectory = path.join(__dirname, "uploads/usersTemplates");
const testUsersDirectory = path.join(__dirname, "__tests__/int_tests/temp_uploads");

// Função para garantir que o diretório de teste exista
const ensureTestDirectoryExists = () => {
  if (process.env.NODE_ENV === "test" && !fs.existsSync(testUsersDirectory)) {
    fs.mkdirSync(testUsersDirectory, { recursive: true });
  }
};

// Chama a função para garantir o diretório antes de iniciar os uploads
ensureTestDirectoryExists();

const publicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/publicTemplates"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const usersStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Se o ambiente é de teste, usa o diretório de testes
    const uploadDirectory =
      process.env.NODE_ENV === "test"
        ? testUsersDirectory
        : defaultUsersDirectory;
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de arquivo não suportado. Apenas JPEG e PNG são permitidos."
      ),
      false
    );
  }
};

const publicUpload = multer({
  storage: publicStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
});

const usersUpload = multer({
  storage: usersStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
});

export { publicUpload, usersUpload };
