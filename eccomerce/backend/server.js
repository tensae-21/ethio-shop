// backend/server.js
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/Cart'); // Matches Cart.js casing
const chatRoutes = require('./routes/chatRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in the backend environment.');
}

// Middleware
// Configure CORS to explicitly allow requests from React frontend ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);

// Health check routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is running' });
});

app.get('/', (req, res) => {
  res.send('API Server is running...');
});

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});