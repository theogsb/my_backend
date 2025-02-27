import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Obter o diretório atual do módulo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId } = req.params; // Extraindo o userId da URL

    if (!userId) {
      return cb(new Error('userId é obrigatório'), false);
    }

    const uploadPath = path.join(__dirname, '..', 'uploads', userId); // Usando userId para o diretório

    // Verifique se o diretório existe ou crie-o
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Define o destino do arquivo
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension;
    cb(null, fileName); // Define o nome do arquivo com a data atual para evitar duplicatas
  },
});

export { storage };
