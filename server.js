require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/authRoutes');
// const moduleRoutes = require('./routes/moduleRoutes');
// const permissionRoutes = require('./routes/permissionRoutes');
// const groupRoutes = require('./routes/groupRoutes');
// const groupPermissionRoutes = require('./routes/groupPermissionRoutes');
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => console.error(error));

// app.use('/auth', authRoutes);
// app.use('/modules', moduleRoutes);
// app.use('/permissions', permissionRoutes);
// app.use('/groups', groupRoutes);
// app.use('/groups', groupPermissionRoutes);
// app.use('/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupPermissionRoutes = require('./routes/groupPermissionRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware=require('./middleware/authMiddleware')
const app = express();
app.use(express.json());
app.use(morgan('combined'));
// app.use(morgan('common'));
// app.use(morgan('tiny'));
// app.use(morgan('dev'));
// app.use(authMiddleware);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

  
  app.use('/auth', authRoutes);
app.use('/modules', moduleRoutes);
app.use('/permissions', permissionRoutes);
app.use('/groups',  groupRoutes);
// app.use('/groups/permissions', groupPermissionRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupPermissionRoutes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
