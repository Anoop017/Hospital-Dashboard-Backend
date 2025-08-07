import express from 'express';
import { getPatientsPerWeek } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/patients-per-week', getPatientsPerWeek);

export default router;
