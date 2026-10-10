const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const normalizedPhone = typeof phoneNumber === 'string' ? phoneNumber.trim() : '';

  try {
    if (!normalizedEmail || !normalizedPhone || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Name, email, phone number, and password are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingEmail = await User.exists({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({ message: 'An account already exists with this email. Log in with that address instead.' });
    }

    const existingPhone = await User.exists({ phoneNumber: normalizedPhone });
    if (existingPhone) {
      return res.status(409).json({ message: 'An account already exists with this phone number. Use a different number or log in to that account.' });
    }

    const user = await User.create({
      fullName: (typeof fullName === 'string' && fullName.trim()) || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      passwordHash: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const fieldName = duplicateField === 'email'
        ? 'email'
        : duplicateField === 'phoneNumber'
          ? 'phone number'
          : null;
      return res.status(409).json({
        message: fieldName
          ? `An account already exists with this ${fieldName}. Use another ${fieldName} or log in to that account.`
          : 'An account with these details already exists. Please log in or use different account details.',
      });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  try {
    if (!normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

module.exports = { registerUser, loginUser };