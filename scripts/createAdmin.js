import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const MONGODB_URI = 'mongodb+srv://anoopsnair1123:raQsNSheJ49IQjji@cluster0.9uh1u.mongodb.net/hospital-dashboard';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin96@hospital.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin96@hospital.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:', adminUser.email);
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

const createSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample doctor
    const doctorUser = await User.create({
      name: 'Dr. Jane Smith',
      email: 'doctor@hospital.com',
      password: 'doctor123',
      role: 'doctor'
    });

    await Doctor.create({
      user: doctorUser._id,
      specialization: 'Cardiology',
      licenseNumber: 'DOC123456',
      phone: '+1234567890',
      experience: 10,
      education: ['MBBS', 'MD Cardiology'],
      isAvailable: true
    });

    console.log('Sample doctor created:', doctorUser.email);
    console.log('Password: doctor123');

    // Create sample patient
    const patientUser = await User.create({
      name: 'John Doe',
      email: 'patient@hospital.com',
      password: 'patient123',
      role: 'patient'
    });

    console.log('Sample patient created:', patientUser.email);
    console.log('Password: patient123');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
const args = process.argv.slice(2);
if (args.includes('--admin')) {
  createAdminUser();
} else if (args.includes('--sample')) {
  createSampleData();
} else {
  console.log('Usage:');
  console.log('  node createAdmin.js --admin    # Create admin user');
  console.log('  node createAdmin.js --sample   # Create sample data');
} 