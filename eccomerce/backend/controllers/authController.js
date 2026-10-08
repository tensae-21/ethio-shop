const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { fullName, contact, password } = req.body;

  try {
    if (!fullName || !contact || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ contact });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this Email/Phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      fullName,
      contact,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful',
        user: {
          _id: user._id,
          fullName: user.fullName,
          contact: user.contact
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Please provide credentials' });
    }

    // Find user by contact (Email or Phone)
    const user = await User.findOne({ contact: emailOrPhone });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT Token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secretkey123',
        { expiresIn: '30d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          contact: user.contact,
          isAdmin: user.isAdmin
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };