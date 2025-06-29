import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin/Doctor
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient profile by user ID
// @route   GET /api/patients/profile/:userId
// @access  Private
export const getPatientByUserId = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.userId })
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient by user ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email');

    res.json(updatedPatient);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete associated appointments
    await Appointment.deleteMany({ patient: patient._id });

    // Delete patient
    await patient.deleteOne();

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patients assigned to a doctor
// @route   GET /api/patients/assigned/:doctorId
// @access  Private
export const getAssignedPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.params.doctorId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error('Get assigned patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 