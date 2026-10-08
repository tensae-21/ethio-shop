const express = require('express');
const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth service is running' });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, email, password, name } = req.body;

    if (!email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Mock registration success for development/testing
    const newUser = {
      id: 'usr_' + Date.now(),
      email: email.toLowerCase(),
      phoneNumber: phoneNumber,
      name: name || email.split('@')[0],
      createdAt: new Date()
    };

    return res.status(201).json({
      message: 'Registration successful!',
      user: newUser
    });
  } catch (error) {
    console.error('Registration API Error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'usr_1001',
        email: email.toLowerCase(),
        name: email.split('@')[0]
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;