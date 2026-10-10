const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const CHAPA_API = 'https://api.chapa.co/v1/transaction';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const verifyChapaTransaction = async (txRef) => {
  if (!process.env.CHAPA_SECRET_KEY) {
    throw new Error('Chapa payment is not configured. Set CHAPA_SECRET_KEY in the backend environment.');
  }

  const response = await fetch(`${CHAPA_API}/verify/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error('Chapa could not verify this payment.');
  }

  return result;
};

const markPaymentVerified = async (txRef) => {
  const order = await Order.findOne({ txRef });
  if (!order) return null;

  const verification = await verifyChapaTransaction(txRef);
  const transaction = verification.data || {};
  const paidAmount = Number(transaction.amount);
  const paidCurrency = String(transaction.currency || '').toUpperCase();

  if (
    verification.status !== 'success' ||
    String(transaction.status || '').toLowerCase() !== 'success' ||
    transaction.tx_ref !== txRef ||
    paidCurrency !== 'ETB' ||
    !Number.isFinite(paidAmount) ||
    Math.abs(paidAmount - order.totalAmount) > 0.01
  ) {
    return { order, paid: false };
  }

  order.paymentStatus = 'Paid';
  order.status = 'Confirmed';
  await order.save();
  try {
    await Cart.findOneAndUpdate(
      { userId: order.shippingAddress.email },
      { $set: { items: [] } }
    );
  } catch (error) {
    console.error('Payment succeeded, but the customer cart could not be cleared:', error.message);
  }
  return { order, paid: true };
};

router.post('/', protect, async (req, res) => {
  let order;
  try {
    if (!process.env.CHAPA_SECRET_KEY) {
      return res.status(503).json({
        message: 'Chapa checkout is not configured. Add your Chapa secret key as CHAPA_SECRET_KEY in backend/.env.',
      });
    }

    const { fullName, email, phone, address, city, subcity, woreda, deliveryNotes, items } = req.body;
    if (
      typeof fullName !== 'string' ||
      !fullName.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof phone !== 'string' ||
      !/^(?:\+251|0)?[79]\d{8}$/.test(phone.replace(/\s+/g, '')) ||
      typeof address !== 'string' ||
      !address.trim() ||
      typeof city !== 'string' ||
      !city.trim() ||
      typeof subcity !== 'string' ||
      !subcity.trim()
    ) {
      return res.status(400).json({ message: 'Enter valid shipping details before continuing to Chapa.' });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ message: 'Your cart must contain between 1 and 50 products.' });
    }

    const orderItems = [];
    for (const item of items) {
      const image = item.path || item.imageUrl || item.image || '';
      const product = mongoose.isValidObjectId(item.productId || item._id)
        ? await Product.findById(item.productId || item._id)
        : await Product.findOne({ imageUrl: image });
      const quantity = Number(item.quantity || 1);

      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return res.status(400).json({ message: 'A product in your cart is unavailable or has an invalid quantity. Refresh your cart and try again.' });
      }

      orderItems.push({
        productId: String(product._id),
        title: product.name,
        quantity,
        price: product.price,
        image: product.imageUrl,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingAmount = subtotal > 1500 ? 0 : 150;
    const discountAmount = subtotal >= 3000 ? 300 : 0;
    const totalAmount = Math.max(0, subtotal + shippingAmount - discountAmount);
    const txRef = `ethioshop-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;

    order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAmount,
      discountAmount,
      paymentMethod: 'chapa',
      txRef,
      shippingAddress: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        subcity: subcity.trim(),
        woreda: typeof woreda === 'string' ? woreda.trim() : '',
        deliveryNotes: typeof deliveryNotes === 'string' ? deliveryNotes.trim() : '',
      },
    });

    const nameParts = fullName.trim().split(/\s+/);
    const response = await fetch(`${CHAPA_API}/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalAmount.toFixed(2),
        currency: 'ETB',
        email: email.trim().toLowerCase(),
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' ') || nameParts[0],
        phone_number: phone.trim(),
        tx_ref: txRef,
        ...(process.env.CHAPA_CALLBACK_URL ? { callback_url: process.env.CHAPA_CALLBACK_URL } : {}),
        return_url: `${FRONTEND_URL}/payment/result?tx_ref=${encodeURIComponent(txRef)}`,
        customization: {
          title: 'Ethio Shop',
          description: `Payment for Ethio Shop order ${txRef}`,
        },
      }),
    });
    const chapaResult = await response.json();

    if (!response.ok || chapaResult.status !== 'success' || !chapaResult.data?.checkout_url) {
      await order.deleteOne();
      return res.status(502).json({
        message: 'Chapa could not start checkout. Please check your payment details or try again.',
      });
    }

    return res.status(201).json({
      checkoutUrl: chapaResult.data.checkout_url,
      txRef,
    });
  } catch (error) {
    if (order) await order.deleteOne().catch((deleteError) => {
      console.error('Failed to remove uninitialized Chapa order:', deleteError.message);
    });
    console.error('Chapa checkout initialization failed:', error.message);
    return res.status(502).json({
      message: 'Unable to start Chapa checkout right now. Please try again.',
    });
  }
});

router.post('/chapa/callback', async (req, res) => {
  const txRef = req.body?.tx_ref;
  if (typeof txRef !== 'string' || !txRef) {
    return res.status(400).json({ message: 'Missing Chapa transaction reference.' });
  }

  try {
    const result = await markPaymentVerified(txRef);
    if (!result) return res.status(404).json({ message: 'Order not found.' });
    return res.status(200).json({ success: result.paid });
  } catch (error) {
    console.error('Chapa callback verification failed:', error.message);
    return res.status(502).json({ message: 'Unable to verify Chapa transaction.' });
  }
});

router.get('/payment/verify/:txRef', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ txRef: req.params.txRef, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.paymentStatus !== 'Paid') {
      const verification = await markPaymentVerified(order.txRef);
      if (!verification?.paid) {
        return res.status(402).json({ message: 'Chapa has not confirmed this payment yet.' });
      }
    }

    return res.json({
      success: true,
      orderId: order._id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error('Chapa payment verification failed:', error.message);
    return res.status(502).json({ message: 'Unable to verify payment with Chapa. Please try again.' });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    console.error('Failed to fetch customer orders:', error.message);
    return res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
});

module.exports = router;
