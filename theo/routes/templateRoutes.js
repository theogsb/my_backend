import express from 'express'
import multer from 'multer'
import { storage } from '../config/multerConfig.js'
import templateController from '../controllers/templateController.js'

const router = express.Router();
const upload = multer({ storage: storage});

router.post('/upload/:userId', upload.single('file'), templateController.uploadTemplate);
router.get('/:userId', templateController.getUserTemplates);

export default router