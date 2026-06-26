const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token (Admin Only)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded Admin Credentials
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASSWORD = 'admin123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // We still find the user in DB to get an ID for the token, 
    // or we can mock a fixed ID if you prefer purely hardcoded.
    // Let's assume we want to match a DB record for consistency with models.
    let user = await User.findOne({ email: ADMIN_EMAIL });
    
    // If admin doesn't exist in DB yet, create them
    if (!user) {
      user = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // This will be hashed by the model pre-save
        role: 'admin'
      });
    } else {
      // Ensure password in database is up to date with ADMIN_PASSWORD
      const isMatch = await user.matchPassword(ADMIN_PASSWORD);
      if (!isMatch) {
        user.password = ADMIN_PASSWORD;
        await user.save();
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// Remove registerUser as it's no longer needed
const registerUser = async (req, res) => {
  res.status(403).json({ message: 'Registration is disabled' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
