// Quick script to create admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nca_admin:01Jan08%21@nca-cluster.b78ag8s.mongodb.net/nca');
    console.log('Connected to MongoDB');

    const User = require('./models/User');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Admin email:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('01Jan08!', 12);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@nca.rw',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      profile: {
        firstName: 'Administrator',
        lastName: 'NCA',
        phone: '+250788000000',
        address: 'Nyabihu, Rwanda'
      }
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@nca.rw');
    console.log('Password: 01Jan08!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
