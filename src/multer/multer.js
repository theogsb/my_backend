import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const publicStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/publicTemplates'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const usersStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/usersTemplates'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});



const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Apenas JPEG e PNG são permitidos.'), false);
    }
};

const publicUpload = multer({ 
    storage: publicStorage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 5}
})

const usersUpload = multer({
    storage: usersStorage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 5}
})


export {publicUpload, usersUpload};