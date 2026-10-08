// src/services/cartService.js

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your Express backend URL

export async function fetchUserCart(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${userId}`);
    if (!res.ok) throw new Error('Cart fetch failed');
    return await res.json();
  } catch (error) {
    // Return empty cart fallback on network failure
    return { items: [] };
  }
}

export async function addToCartAPI(userId, product) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, product })
    });
    if (!res.ok) throw new Error('Add to cart failed');
    return await res.json();
  } catch (error) {
    // Return null to trigger local fallback in App.jsx
    return null;
  }
}