require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupPermissionRoutes = require('./routes/groupPermissionRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./Model/UserSchema'); 
const ModulePermissionRout=require('./routes/modulePermission')
const app = express();
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));


const checkSuperadmin = async () => {
  try {
    const superadmin = await User.findOne({ role: 'superadmin' });
    if (!superadmin) {
      console.error('No superadmin user found. Exiting...');
      process.exit(1);
    }

    app.use('/auth', authRoutes);
    app.use('/modules', moduleRoutes);
    app.use('/permissions', permissionRoutes);
    app.use('/', ModulePermissionRout);
    app.use('/groups', groupRoutes);
    app.use('/users', userRoutes);
    app.use('/groups', groupPermissionRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error checking superadmin:', error);
    process.exit(1);
  }
};

// Perform the check and start the server
checkSuperadmin();
