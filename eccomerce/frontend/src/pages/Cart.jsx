import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartShopping, 
  faMinus, 
  faPlus, 
  faReceipt, 
  faArrowLeft, 
  faCircleCheck,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* Quantity Control Component */
const QuantityControl = ({ quantity = 1, onDecrease, onIncrease }) => {
  return (
    <div
      className="d-inline-flex align-items-center rounded-pill shadow-sm"
      style={{
        background: '#FFC107',
        padding: '3px 6px',
        border: '1px solid #e0a800',
      }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="btn btn-sm shadow-none p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: '28px',
          height: '28px',
          background: quantity <= 1 ? 'rgba(0,0,0,0.1)' : '#1A1D20',
          color: quantity <= 1 ? '#6c757d' : '#FFC107',
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faMinus} className="fs-6" />
      </button>

      <span className="fw-bold text-dark px-2" style={{ minWidth: '36px', textAlign: 'center', fontSize: '0.95rem' }}>
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        className="btn btn-sm shadow-none p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: '28px',
          height: '28px',
          background: '#1A1D20',
          color: '#FFC107',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faPlus} className="fs-6" />
      </button>
    </div>
  );
};

/* Individual Cart Item Row */
const CartItemRow = ({ item = {}, onUpdateQuantity, onRemoveItem }) => {
  const itemId = String(item._id || item.id || item.productId || item.path || '');
  const itemPrice = Number(item.price || 0);
  const itemQty = Number(item.quantity || 1);
  const itemTotal = itemPrice * itemQty;
  const imageSrc = item.path || item.image || item.imageUrl || '/images/placeholder.png';
  const itemName = item.desc || item.title || item.name || 'Product';

  return (
    <div className="card border-0 rounded-3 mb-3 bg-white p-3 shadow-sm" style={{ borderLeft: '4px solid #FFC107' }}>
      <div className="row align-items-center text-center text-md-start g-3">
        
        {/* Product Image & Name */}
        <div className="col-12 col-md-4 d-flex align-items-center gap-3">
          <div 
            className="rounded-3 border overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center bg-light" 
            style={{ width: '70px', height: '70px' }}
          >
            <img src={imageSrc} alt={itemName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h6 className="fw-bold text-dark mb-1 lh-sm">{itemName}</h6>
            <small className="text-muted d-block">ID: {itemId.slice(-6) || 'N/A'}</small>
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-4 col-md-2">
          <span className="fw-bold text-dark">{itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr</span>
        </div>

        {/* Quantity Controls */}
        <div className="col-4 col-md-3 text-center">
          <QuantityControl
            quantity={itemQty}
            onDecrease={() => onUpdateQuantity(itemId, Math.max(1, itemQty - 1))}
            onIncrease={() => onUpdateQuantity(itemId, itemQty + 1)}
          />
        </div>

        {/* Item Subtotal */}
        <div className="col-4 col-md-2 text-md-end">
          <span className="fw-bold text-dark fs-6">{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr</span>
        </div>

        {/* Delete Button */}
        <div className="col-12 col-md-1 text-md-end text-center">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-circle p-2"
            title="Remove item"
            onClick={() => onRemoveItem(itemId, itemName)}
            style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faTrashCan} className="fs-6" />
          </button>
        </div>

      </div>
    </div>
  );
};

/* Order Summary Component */
const OrderSummary = ({ subtotal = 0, shipping = 0, discount = 0, grandTotal = 0, onCheckout }) => (
  <div className="card border-0 rounded-4 shadow-sm bg-white p-4 sticky-top" style={{ top: '90px' }}>
    <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
      <FontAwesomeIcon icon={faReceipt} className="me-2 text-warning" /> Order Summary
    </h5>

    <div className="d-flex justify-content-between mb-2">
      <span className="text-muted">Subtotal</span>
      <span className="fw-bold text-dark">{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr</span>
    </div>

    <div className="d-flex justify-content-between mb-2">
      <span className="text-muted">Shipping</span>
      <span className="fw-bold text-success">{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} Birr`}</span>
    </div>

    {discount > 0 && (
      <div className="d-flex justify-content-between mb-2 text-danger">
        <span>Discount</span>
        <span className="fw-bold">-{discount.toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr</span>
      </div>
    )}

    <hr className="my-3" />

    <div className="d-flex justify-content-between align-items-center mb-4">
      <span className="fw-bold fs-5 text-dark">Total</span>
      <span className="fw-bold fs-4 text-dark">{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr</span>
    </div>

    <button
      onClick={onCheckout}
      className="btn w-100 fw-bold py-3 rounded-3 text-dark shadow-sm d-flex align-items-center justify-content-center gap-2"
      style={{ backgroundColor: '#FFC107', border: 'none' }}
    >
      <FontAwesomeIcon icon={faLock} />
      <span>Proceed to Checkout</span>
    </button>
  </div>
);

/* Main Cart Component */
export default function Cart({ 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  user 
}) {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  const subtotal = safeCartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 
    0
  );
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const discount = subtotal >= 3000 ? 300 : 0;
  const grandTotal = Math.max(0, subtotal + shipping - discount);

  // Sync latest cart state to Express/MongoDB backend
  const syncCartToBackend = async (updatedItems) => {
    try {
      const currentUserId = user?.email || localStorage.getItem('app_user') || 'GUEST_USER';
      await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, items: updatedItems })
      });
    } catch (err) {
      console.warn('Backend cart sync failed, relying on local state.');
    }
  };

  // DIRECT NAVIGATION TO SHIPPING CHECKOUT (No Login Redirect)
  const handleProceedToCheckout = async () => {
    try {
      await syncCartToBackend(safeCartItems);
    } catch (err) {
      console.warn('Proceeding to checkout with local state.');
    } finally {
      // Directs every user straight to the shipping information page
      navigate('/checkout');
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: '80vh' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show bg-dark text-white rounded-3 shadow px-3 py-2 d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} className="text-warning fs-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-dark mb-0">
          <FontAwesomeIcon icon={faCartShopping} className="me-2 text-warning" /> Your Shopping Cart
        </h2>
        <span className="badge bg-dark text-warning fs-6 px-3 py-2 rounded-pill">
          {safeCartItems.length} {safeCartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {safeCartItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border my-4">
          <h4 className="fw-bold text-dark">Your Cart is Empty</h4>
          <p className="text-muted">Explore Ethio Shop to add items to your cart.</p>
          <Link to="/" className="btn fw-bold px-4 py-2 text-dark rounded-pill mt-2" style={{ backgroundColor: '#FFC107' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* Left Column: Cart Items List */}
          <div className="col-lg-8">
            {safeCartItems.map((item, index) => (
              <CartItemRow
                key={item._id || item.id || item.productId || item.path || index}
                item={item}
                onUpdateQuantity={(id, newQty) => {
                  if (onUpdateQuantity) onUpdateQuantity(id, newQty);
                }}
                onRemoveItem={(id, name) => {
                  if (onRemoveItem) onRemoveItem(id);
                  showToast(`Removed "${name || 'Item'}" from cart.`);
                }}
              />
            ))}

            <div className="d-flex justify-content-between align-items-center pt-3">
              <Link to="/" className="btn btn-outline-dark rounded-pill px-4 fw-bold btn-sm">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-4">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              grandTotal={grandTotal}
              onCheckout={handleProceedToCheckout}
            />
          </div>

        </div>
      )}
    </div>
  );
}