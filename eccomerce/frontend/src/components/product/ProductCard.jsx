// src/components/ProductCard.jsx
import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents page reload or link navigation if nested
    e.stopPropagation();

    onAddToCart(product);

    // Provide visual feedback without changing the page
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
      <div 
        className="d-flex align-items-center justify-content-center bg-light rounded-3 p-2 mb-3" 
        style={{ height: '180px' }}
      >
        <img
          src={product.path || product.image || '/images/placeholder.png'}
          alt={product.desc || product.title}
          className="img-fluid object-fit-contain"
          style={{ maxHeight: '150px' }}
        />
      </div>

      <div className="d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h6 className="fw-bold text-dark text-truncate mb-1">
            {product.desc || product.title}
          </h6>
          <p className="fw-bold fs-5 text-dark mb-3">
            {(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr
          </p>
        </div>

        {/* Add to Cart button stays on current page */}
        <button
          type="button"
          className={`btn ${isAdded ? 'btn-success' : 'btn-warning'} w-100 fw-bold rounded-3 shadow-sm transition-all`}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <i className="fa-solid fa-check me-2"></i>Added
            </>
          ) : (
            <>
              <i className="fa-solid fa-cart-plus me-2"></i>Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;