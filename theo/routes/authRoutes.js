import express from "express"
import { loginAndSaveUser, deleteUser, getUser } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/profile/login', loginAndSaveUser);
router.delete('/profile/delete/:email', deleteUser);
router.get('/profile/:email', getUser);

export default router

