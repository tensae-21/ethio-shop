import React, { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.warn('Backend offline, using sample orders.');
        setOrders([
          {
            _id: 'ORD-98231',
            createdAt: new Date(),
            totalAmount: 1500,
            status: 'Delivered',
            paymentStatus: 'Paid',
            items: [{ title: "Men's Jeans", quantity: 1, price: 1500 }],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-5">Loading orders...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <i className="fa-solid fa-box-open fs-1 text-muted mb-3"></i>
          <p className="lead text-secondary m-0">No orders found.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm p-3 rounded-3">
              <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                <div>
                  <span className="fw-bold text-dark me-2">Order ID: {order._id}</span>
                  <span className="text-muted fs-7">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="badge bg-success me-2">{order.status}</span>
                  <span className="badge bg-secondary">{order.paymentStatus}</span>
                </div>
              </div>

              <div className="mb-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between fs-7 py-1">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="fw-semibold">ETB {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold text-warning fs-5">ETB {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}