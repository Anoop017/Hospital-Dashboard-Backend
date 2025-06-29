import express from 'express';
import {
  getPatients,
  getPatient,
  getPatientByUserId,
  updatePatient,
  deletePatient,
  getAssignedPatients
} from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(authorize('admin', 'doctor'), getPatients);

router.route('/:id')
  .get(getPatient)
  .put(authorize('admin', 'doctor'), updatePatient)
  .delete(authorize('admin'), deletePatient);

router.get('/profile/:userId', getPatientByUserId);
router.get('/assigned/:doctorId', authorize('admin', 'doctor'), getAssignedPatients);

export default router; 