require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

connectDB().then(async () => {
    try {
        await User.create({
            name: 'John Maintenance',
            email: 'employee@hostel.com',
            password: 'employee123',
            role: 'employee',
            hostel: 'All',
            roomNumber: 'Workshop'
        });
        console.log('Employee seeded successfully.');
    } catch(e) {
        console.error(e);
    }
    process.exit();
});
