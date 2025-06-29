import express from 'express';
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(authorize('admin', 'doctor'), createAppointment)
  .get(authorize('admin', 'doctor'), getAppointments);

router.get('/my', getMyAppointments);

router.route('/:id')
  .get(getAppointment)
  .put(authorize('admin', 'doctor'), updateAppointment)
  .delete(authorize('admin'), deleteAppointment);

export default router; 