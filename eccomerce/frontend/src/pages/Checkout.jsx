import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTruckFast, 
  faShieldHalved, 
  faReceipt 
} from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout({ cartItems = [], user }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    address: '',
    city: 'Addis Ababa',
    subcity: '',
    woreda: '',
    deliveryNotes: '',
  });

  // Calculate Totals
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 
    0
  );
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const discount = subtotal >= 3000 ? 300 : 0;
  const grandTotal = Math.max(0, subtotal + shipping - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (safeCartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ ...formData, items: safeCartItems }),
      });

      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.message || 'Could not start Chapa checkout.');
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Network error. Unable to process your order.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: '80vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-dark mb-0">
          <FontAwesomeIcon icon={faTruckFast} className="me-2 text-warning" /> Shipping & Checkout
        </h2>
        <Link to="/cart" className="btn btn-outline-dark rounded-pill btn-sm fw-bold">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmitOrder}>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="row g-4">
          
          {/* Shipping Details */}
          <div className="col-lg-8">
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 mb-4" style={{ borderLeft: '4px solid #FFC107' }}>
              <h5 className="fw-bold text-dark mb-3">1. Shipping Address</h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="form-control rounded-3"
                    placeholder="Abebe Bikila"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="form-control rounded-3"
                    placeholder="0911223344"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control rounded-3"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="form-control rounded-3"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">Subcity / Region *</label>
                  <input
                    type="text"
                    name="subcity"
                    required
                    className="form-control rounded-3"
                    placeholder="Bole, Kirkos, etc."
                    value={formData.subcity}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-muted small">Woreda / Area</label>
                  <input
                    type="text"
                    name="woreda"
                    className="form-control rounded-3"
                    placeholder="Woreda 03"
                    value={formData.woreda}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-muted small">Street / House No. *</label>
                  <textarea
                    name="address"
                    required
                    rows="2"
                    className="form-control rounded-3"
                    placeholder="House number or street details..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-muted small">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    className="form-control rounded-3"
                    placeholder="e.g. Call before delivery"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Chapa is the only supported payment option */}
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
              <h5 className="fw-bold text-dark mb-3">2. Payment Method</h5>
              <div className="border border-warning rounded-3 p-3 d-flex align-items-center gap-3 bg-light">
                <span className="badge text-bg-dark fs-6">Chapa</span>
                <div>
                  <p className="fw-bold mb-1">Secure online payment</p>
                  <p className="small text-muted mb-0">You will be redirected to Chapa to complete payment securely.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Summary */}
          <div className="col-lg-4">
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">
                <FontAwesomeIcon icon={faReceipt} className="me-2 text-warning" /> Items Summary
              </h5>

              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {safeCartItems.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="text-truncate me-2" style={{ maxWidth: '180px' }}>
                      <small className="fw-bold text-dark d-block text-truncate">{item.desc || item.title || item.name || 'Product'}</small>
                      <small className="text-muted">Qty: {item.quantity || 1}</small>
                    </div>
                    <small className="fw-bold text-dark">
                      {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr
                    </small>
                  </div>
                ))}
              </div>

              <hr />

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
                type="submit"
                disabled={loading}
                className="btn w-100 fw-bold py-3 rounded-3 text-dark shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#FFC107', border: 'none' }}
              >
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>{loading ? 'Processing Order...' : 'Place Order Now'}</span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}