import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileControllers.js';

const router = express.Router();

router.get('/profile/:email', getUserProfile);
router.put('/profile/:email', updateUserProfile);

export default router;