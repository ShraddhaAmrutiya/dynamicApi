const User = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");


const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Token verification error:", error); 
    res.status(403).json({ message: "Invalid token" });
  }
};
module.exports = authMiddleware;
