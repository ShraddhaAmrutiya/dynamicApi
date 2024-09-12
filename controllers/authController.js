const User = require('../Model/UserSchema');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const registerUser = async (req, res) => {
  const { username, password,role } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Fill the required fields." });
  }
  if (role && role !== 'user') {
    return res.status(400).json({ message: 'Invalid role. Only "user" role is allowed.' });
  }
  

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      _id: newUser._id,
      username: newUser.username
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send({ message: "Fill the required fields." });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
   
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '15m' });

    res.status(200).json({ message:"user login successfully.",accessToken, refreshToken });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
  
  
};
const refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.status(200).json({ accessToken });
  });
};


const readedUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().select('_id username').skip(skip).limit(limit),
      User.countDocuments()
    ]);

    res.status(200).json({
       users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateUser = async (req, res) => {
  const { role } = req.body;
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;
  const { id } = req.params;

  try {
    if (currentUserRole === "admin" && currentUserId === id) {
      return res.status(403).json({ message: "Admins cannot update their own information." });
    }

    if (currentUserRole === "superadmin" && currentUserId === id && role) {
      return res.status(403).json({ message: "Superadmins cannot change their own role." });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "superadmin") {
      return res.status(403).json({ message: "No user can be assigned the role of superadmin." });
    }

    if (currentUserRole === "admin") {
      if (role === "superadmin") {
        return res.status(403).json({ message: "Admins cannot promote to superadmin." });
      }
      if (userToUpdate.role === "superadmin") {
        return res.status(403).json({ message: "Admins cannot modify a superadmin." });
      }
    }

    if (currentUserRole === "superadmin") {
      if (id === currentUserId.toString()) {
        return res.status(403).json({ message: "Superadmins cannot change their own role." });
      }
    }

  
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully",updatedUser: updatedUser.username});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted!",deletedUser:deletedUser.username });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports = {registerUser, loginUser, refresh, readedUser,updateUser, deleteUser };
