// src/components/cart/CartItem.jsx
import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const itemTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body p-3">
        <div className="row align-items-center">
          
          {/* Product Image */}
          <div className="col-3 col-md-2 text-center">
            <img
              src={item.image || item.img || '/images/placeholder.png'}
              alt={item.title || item.name}
              className="img-fluid rounded"
              style={{ maxHeight: '75px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/75?text=Product';
              }}
            />
          </div>

          {/* Product Name & Price directly underneath */}
          <div className="col-9 col-md-4">
            <h6 className="mb-1 fw-bold text-dark text-truncate">
              {item.title || item.name}
            </h6>
            <div className="fw-semibold text-primary">
              {(item.price || 0).toLocaleString()} ETB
            </div>
          </div>

          {/* Quantity Controls (Increase / Decrease) */}
          <div className="col-7 col-md-3 my-2 my-md-0">
            <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => onUpdateQuantity(item.id || item._id, (item.quantity || 1) - 1)}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="form-control text-center bg-light fw-bold">
                {item.quantity || 1}
              </span>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => onUpdateQuantity(item.id || item._id, (item.quantity || 1) + 1)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Item Total Price & Delete Button for each product */}
          <div className="col-5 col-md-3 d-flex align-items-center justify-content-end gap-3">
            <span className="fw-bold fs-6 text-dark">
              {itemTotal.toLocaleString()} ETB
            </span>
            <button
              className="btn btn-sm btn-outline-danger border-0"
              title="Delete item"
              onClick={() => onRemoveItem(item.id || item._id)}
            >
              <i className="fa-solid fa-trash-can fs-5"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartItem;