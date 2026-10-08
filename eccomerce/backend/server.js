// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/Cart'); // Matches Cart.js casing

const app = express();

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