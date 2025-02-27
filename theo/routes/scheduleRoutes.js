import express from 'express';
import { createSchedule, getSchedule, deleteSchedule, updateSchedule } from '../controllers/scheduleControllers.js';

const router = express.Router();

router.post('/calendar/schedule/:email', createSchedule);
router.get('/calendar/schedule/:email', getSchedule);
router.delete('/calendar/schedule/:email/:scheduleId', deleteSchedule);
router.put('/calendar/schedule/:email/:scheduleId', updateSchedule);

export default router;