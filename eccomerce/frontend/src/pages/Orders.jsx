import { useEffect, useState } from 'react';
import { PackageOpen } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to load your orders.');
        if (active) setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        if (active) setErrorMessage(error.message || 'Could not connect to the orders service.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrders();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="text-center py-5" role="status">Loading orders...</div>;

  return (
    <div className="py-3">
      {errorMessage ? (
        <div className="alert alert-danger" role="alert">{errorMessage}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <PackageOpen size={42} className="text-muted mb-3" aria-hidden="true" />
          <p className="lead text-secondary m-0">No orders found.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <article key={order._id} className="card border-0 shadow-sm p-3 rounded-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 border-bottom pb-2 gap-2">
                <div>
                  <span className="fw-bold text-dark me-2">Order: {order._id}</span>
                  <span className="text-muted small">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="badge bg-success me-2">{order.status}</span>
                  <span className="badge bg-secondary">{order.paymentStatus}</span>
                </div>
              </div>

              <div className="mb-2">
                {(order.items || []).map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="d-flex justify-content-between small py-1 gap-3">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="fw-semibold text-nowrap">
                      ETB {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold text-warning fs-5">ETB {Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
