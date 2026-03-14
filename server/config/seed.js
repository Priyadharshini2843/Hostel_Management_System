const mongoose = require('mongoose');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hostel.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Seeding initial admin user...');
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      const adminUser = new User({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        hostel: 'All',
        roomNumber: 'Office'
      });

      await adminUser.save();
      console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('Admin user already exists.');
    }

    const employeesToSeed = [
      { name: 'John', email: 'john@hostel.com', password: 'password123', role: 'employee', department: 'Electrical' },
      { name: 'Ravi', email: 'ravi@hostel.com', password: 'password123', role: 'employee', department: 'Plumbing' },
      { name: 'Kumar', email: 'kumar@hostel.com', password: 'password123', role: 'employee', department: 'Furniture' },
      { name: 'Suresh', email: 'suresh@hostel.com', password: 'password123', role: 'employee', department: 'Electrical' }
    ];

    for (const emp of employeesToSeed) {
      const empExists = await User.findOne({ email: emp.email });
      if (!empExists) {
        console.log(`Seeding employee: ${emp.name} (${emp.department})`);
        const newEmp = new User(emp);
        await newEmp.save();
      }
    }

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedDatabase;
