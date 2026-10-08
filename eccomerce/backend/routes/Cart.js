const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET user cart
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching cart', error: err.message });
  }
});

// POST add product to cart
router.post('/add', async (req, res) => {
  const { userId, product } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if user has none
      cart = new Cart({
        userId,
        items: [{
          productId: String(product.id),
          name: product.name || product.title,
          price: product.price,
          img: product.img,
          quantity: 1
        }]
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.productId === String(product.id));

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId: String(product.id),
          name: product.name || product.title,
          price: product.price,
          img: product.img,
          quantity: 1
        });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating cart', error: err.message });
  }
});

module.exports = router;