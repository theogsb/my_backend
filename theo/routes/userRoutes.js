import express from 'express';
import { addTemplate, addSchedule } from '../controllers/userControllers.js'; 

const router = express.Router();

router.post('/:email/template', addTemplate);
router.post('/:email/schedule', addSchedule);

export default router
