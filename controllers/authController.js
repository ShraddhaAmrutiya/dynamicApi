const User = require('../Model/UserSchema');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

//register user
const registerUser = async (req, res) => {
  const { username, password,role } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Fill the required fields." });
  }
  if (role && role !== 'user') {
    return res.status(400).json({ message: 'Invalid role. Only "user" role is allowed.' });
  }
  

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create new user and save
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      _id: newUser._id,
      username: newUser.username
      // role: newUser.role,
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

//user login
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

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
  
  
};
//refresh token
const refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.status(200).json({ accessToken });
  });
};

// list user
const readedUser= async(req,res)=>{
  try {
      const user= await User.find();
      res.json(user)
  } catch (error) {
      res.status(500).send(error);
  }
};
//user update
// const updateUser = async (req, res) => {
//   try {
//     const updateU = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updateU) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).json(updateU);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

//add roles that can update for example superadmin update user and update,
// admin can update user but not assign superaddmin role & do not change themselves 
const updateUser = async (req, res) => {
  const { role } = req.body;
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;
  const { id } = req.params;

  try {
    // Prevent admins from updating themselves
    if (currentUserRole === "admin" && currentUserId === id) {
      return res.status(403).json({ message: "Admins cannot update their own information." });
    }

    // Prevent superadmins from changing their own role
    if (currentUserRole === "superadmin" && currentUserId === id && role) {
      return res.status(403).json({ message: "Superadmins cannot change their own role." });
    }

    // Find the target user (the one being updated)
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent role changes to 'superadmin'
    if (role === "superadmin") {
      return res.status(403).json({ message: "No user can be assigned the role of superadmin." });
    }

    // Prevent role changes for admin users
    if (currentUserRole === "admin") {
      // Admins can only promote to "admin", but not "superadmin"
      if (role === "superadmin") {
        return res.status(403).json({ message: "Admins cannot promote to superadmin." });
      }
      // Admin cannot change the role of a superadmin
      if (userToUpdate.role === "superadmin") {
        return res.status(403).json({ message: "Admins cannot modify a superadmin." });
      }
    }

    // Superadmins can update any role, except their own role
    if (currentUserRole === "superadmin") {
      // Superadmins cannot update their own role to superadmin
      if (id === currentUserId.toString()) {
        return res.status(403).json({ message: "Superadmins cannot change their own role." });
      }
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully", updatedUser });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const deleteU = await User.findByIdAndDelete(req.params.id);
    if (!deleteU) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports = {registerUser, loginUser, refresh, readedUser,updateUser, deleteUser };
