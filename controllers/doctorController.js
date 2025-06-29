import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor profile by user ID
// @route   GET /api/doctors/profile/:userId
// @access  Private
export const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.userId })
      .populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor by user ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email');

    res.json(updatedDoctor);
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Remove doctor from assigned patients
    await Patient.updateMany(
      { assignedDoctor: doctor._id },
      { $unset: { assignedDoctor: 1 } }
    );

    // Delete associated appointments
    await Appointment.deleteMany({ doctor: doctor._id });

    // Delete doctor
    await doctor.deleteOne();

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign patient to doctor
// @route   PUT /api/doctors/:doctorId/assign-patient/:patientId
// @access  Private/Admin
export const assignPatientToDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.assignedDoctor = doctorId;
    await patient.save();

    await patient.populate([
      { path: 'user', select: 'name email' },
      { path: 'assignedDoctor', populate: { path: 'user', select: 'name email' } }
    ]);

    res.json(patient);
  } catch (error) {
    console.error('Assign patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialization/:specialization
// @access  Private
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialization: { $regex: req.params.specialization, $options: 'i' },
      isAvailable: true
    })
      .populate('user', 'name email')
      .sort({ experience: -1 });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors by specialization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 