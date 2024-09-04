const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true, 
    trim: true,
    match: [ /^[a-zA-Z0-9._-]{3,50}$/, 'Please enter valid user name.'],
    index: true,
  },
  password:  { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long']},
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
      message: '{VALUE} is not a valid role',
      index: true
    }
    ,
  groups: [{ type:String, ref: "Group" }],
});


// Pre-save hook to check superadmin constraints
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.role === "superadmin") {
      
      const existingSuperAdmin = await this.constructor.findOne({ role: "superadmin" });
      if (existingSuperAdmin) {
        return next(new Error('Superadmin already exists.'));
      }
    }
    if (this.role === "admin") {
      return next(new Error('Admin creation is not allowed.'));
    }
  }
  next();
});


///hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare pasword
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
