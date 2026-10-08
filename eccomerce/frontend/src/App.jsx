import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout Components
import Navbar from './components/common/Navbar';
import Hero from './components/common/Hero';
import Products from './components/common/Products';
import ShopCategories from './components/common/ShopCategories';
import Footer from './components/common/Footer';

// Import Product & Checkout Components
import ProductDetail from './components/product/ProductDetail';

// Backend Service Imports
import { fetchUserCart, addToCartAPI } from './services/cartService';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const HomePage = ({ selectedCategory, setSelectedCategory, onAddToCart }) => (
  <main>
    {!selectedCategory && <Hero onAddToCart={onAddToCart} />}
    <ShopCategories 
      selectedCategory={selectedCategory} 
      setSelectedCategory={setSelectedCategory} 
      onAddToCart={onAddToCart}
    />
  </main>
);

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Initialize cart state from local storage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ethioshop_cart');
      return savedCart ? { items: JSON.parse(savedCart) } : { items: [] };
    } catch (err) {
      return { items: [] };
    }
  });

  // Store user session state persistently across refreshes
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('app_user') || localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  const currentUserId = user?.email || 'USER_DEMO_123';

  // Synchronize user state with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('app_user', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('app_user');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Failed to sync user session to localStorage', err);
    }
  }, [user]);

  // Synchronize local cart state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ethioshop_cart', JSON.stringify(cart.items || []));
    } catch (err) {
      console.error('Failed to sync cart to localStorage', err);
    }
  }, [cart.items]);

  // Fetch initial cart from backend
  useEffect(() => {
    let isMounted = true;
    async function loadCart() {
      try {
        const data = await fetchUserCart(currentUserId);
        if (data && data.items && isMounted) {
          setCart(data);
        }
      } catch (err) {
        console.warn('Backend offline, using local cart state.');
      }
    }
    loadCart();
    return () => { isMounted = false; };
  }, [currentUserId]);

  // Safe Immutable Add to Cart Handler
  const handleAddToCart = async (product) => {
    const addQuantity = Number(product.quantity || 1);
    const targetId = String(product._id || product.id || product.productId || product.path || '');

    try {
      const updatedCart = await addToCartAPI(currentUserId, { ...product, quantity: addQuantity });
      if (updatedCart && updatedCart.items) {
        setCart(updatedCart);
        return;
      }
    } catch (err) {
      console.warn('Backend update failed, using local update.');
    }

    // Immutable Local Cart Update
    setCart((prevCart) => {
      const existingItems = prevCart.items || [];
      const exists = existingItems.some(
        (i) => String(i._id || i.id || i.productId || i.path) === targetId
      );

      if (exists) {
        return {
          ...prevCart,
          items: existingItems.map((item) => {
            const itemId = String(item._id || item.id || item.productId || item.path);
            return itemId === targetId
              ? { ...item, quantity: Number(item.quantity || 1) + addQuantity }
              : item;
          })
        };
      }

      return {
        ...prevCart,
        items: [
          ...existingItems,
          { 
            id: targetId, 
            productId: targetId, 
            quantity: addQuantity, 
            ...product 
          }
        ]
      };
    });
  };

  // Safe Quantity Update
  const handleUpdateQuantity = (id, newQuantity) => {
    const targetId = String(id);
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        items: (prevCart.items || []).map((item) => {
          const itemId = String(item._id || item.id || item.productId || item.path);
          return itemId === targetId ? { ...item, quantity: newQuantity } : item;
        })
      }));
    }
  };

  // Safe Item Removal
  const handleRemoveItem = (id) => {
    const targetId = String(id);
    setCart((prevCart) => ({
      ...prevCart,
      items: (prevCart.items || []).filter((item) => {
        const itemId = String(item._id || item.id || item.productId || item.path);
        return itemId !== targetId;
      })
    }));
  };

  // Clear Cart Handler
  const handleClearCart = () => {
    setCart({ items: [] });
    localStorage.removeItem('ethioshop_cart');
  };

  // Logout Handler
  const handleLogout = () => {
    setUser(null);
  };

  // User Auth Callback Handler
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };
  

  const cartItems = cart.items || [];
  const totalCartCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <Navbar 
        cartItems={cartItems} 
        cartItemsCount={totalCartCount} 
        cartTotalPrice={totalCartPrice} 
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                onAddToCart={handleAddToCart}
              />
            } 
          />

          <Route 
            path="/products" 
            element={<Products onAddToCart={handleAddToCart} />} 
          />

          <Route 
            path="/product/:id" 
            element={<ProductDetail onAddToCart={handleAddToCart} />} 
          />

          <Route 
            path="/cart" 
            element={
              <Cart 
                cartItems={cartItems} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem} 
                onClearCart={handleClearCart}
                user={user} 
              />
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <Checkout 
                cartItems={cartItems} 
                user={user} 
                onClearCart={handleClearCart} 
              />
            } 
          />

          <Route 
            path="/register" 
            element={<Register onLoginSuccess={handleLoginSuccess} setUser={setUser} />} 
          />

          <Route 
            path="/login" 
            element={<Login onLoginSuccess={handleLoginSuccess} setUser={setUser} />} 
          />

          <Route 
            path="*" 
            element={
              <div className="container py-5 text-center">
                <h2 className="fw-bold text-dark">404 - Page Not Found</h2>
                <p className="text-muted">The page you are looking for does not exist.</p>
              </div>
            } 
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}