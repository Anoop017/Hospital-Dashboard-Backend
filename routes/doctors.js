import express from 'express';
import {
  getDoctors,
  getDoctor,
  getDoctorByUserId,
  updateDoctor,
  deleteDoctor,
  assignPatientToDoctor,
  getDoctorsBySpecialization
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getDoctors);

router.route('/:id')
  .get(getDoctor)
  .put(authorize('admin', 'doctor'), updateDoctor)
  .delete(authorize('admin'), deleteDoctor);

router.get('/profile/:userId', getDoctorByUserId);
router.get('/specialization/:specialization', getDoctorsBySpecialization);
router.put('/:doctorId/assign-patient/:patientId', authorize('admin'), assignPatientToDoctor);

export default router; 