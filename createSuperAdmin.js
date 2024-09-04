require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Model/UserSchema'); 

const { MONGO_URI } = process.env;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Get command-line arguments
const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error('Please provide both username and password as arguments.');
  process.exit(1);
}

// Create a new superadmin user
const createSuperAdmin = async () => {
  try {
    // Check if a superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

    if (existingSuperAdmin) {
      console.log('Superadmin already exists.');
      process.exit(0);
    }

    // Create a new superadmin user
    const superAdmin = new User({ username, password, role: 'superadmin' });
    await superAdmin.save();

    console.log('Superadmin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
