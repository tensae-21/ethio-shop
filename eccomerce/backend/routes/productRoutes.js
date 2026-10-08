const express = require('express');
const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  res.json({ message: 'Product route working' });
});

module.exports = router;