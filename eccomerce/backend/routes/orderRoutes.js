const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { 
      userId, 
      fullName, 
      phone, 
      address, 
      city, 
      region, 
      notes, 
      paymentMethod, 
      paymentRef, 
      items 
    } = req.body;

    // Server-side field presence validation
    if (!fullName || !phone || !address || !city || !region) {
      return res.status(400).json({ 
        success: false, 
        message: 'All shipping information fields are required.' 
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cart cannot be empty.' 
      });
    }

    // Name regex: Allows letters (English & Amharic) and spaces
    const nameRegex = /^[A-Za-z\u00C0-\u024F\u1200-\u137F\s]+$/;
    if (!nameRegex.test(fullName.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full Name can only contain letters and spaces.' 
      });
    }

    // Ethiopian Phone validation: 09, 07, or +251
    const ethioPhoneRegex = /^(?:\+251|0)?[79]\d{8}$/;
    if (!ethioPhoneRegex.test(phone.replace(/\s+/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid Ethiopian phone number.' 
      });
    }

    // Financial calculations
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 
      0
    );
    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
    const discount = subtotal >= 3000 ? 300 : 0;
    const grandTotal = Math.max(0, subtotal + shipping - discount);

    // Map cart items
    const formattedItems = items.map((i) => ({
      productId: String(i.id || i.productId || i._id),
      title: i.desc || i.title || i.name || 'Product',
      price: Number(i.price || 0),
      quantity: Number(i.quantity || 1),
      path: i.path || i.image || ''
    }));

    // Construct new order document
    const newOrder = new Order({
      userId: userId || 'GUEST_USER',
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        region: region.trim(),
        notes: notes ? notes.trim() : ''
      },
      items: formattedItems,
      financials: {
        subtotal,
        shipping,
        discount,
        grandTotal
      },
      payment: {
        method: paymentMethod || 'telebirr',
        reference: paymentRef ? paymentRef.trim() : '',
        status: 'Pending'
      }
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      orderId: savedOrder._id,
      order: savedOrder
    });

  } catch (error) {
    console.error('Error saving order to MongoDB:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while processing your order.' 
    });
  }
});

// GET /api/orders/user/:userId - Retrieve user order history
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

module.exports = router;