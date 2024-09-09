const User = require('../Model/UserSchema');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

//register user
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Fill the required fields." });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create new user and save
    const newUser = new User({ username, password, role });
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
   
    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err); // Log the error for debugging
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
const updateUser = async (req, res) => {
  try {
    const updateU = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateU) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updateU);
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
