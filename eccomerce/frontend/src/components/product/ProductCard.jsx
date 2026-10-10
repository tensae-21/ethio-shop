// src/components/ProductCard.jsx
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents page reload or link navigation if nested
    e.stopPropagation();

    onAddToCart?.(product);

    // Provide visual feedback without changing the page
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
      <div
        className="position-relative d-flex align-items-center justify-content-center bg-light rounded-3 p-2 mb-3"
        style={{ height: '180px' }}
      >
        <img
          src={product.path || product.image || '/images/placeholder.png'}
          alt={product.desc || product.title}
          className="img-fluid object-fit-contain"
          style={{ maxHeight: '150px' }}
        />
        <button
          type="button"
          className="product-cart-button"
          onClick={handleAddToCart}
          aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
          title={isAdded ? 'Added to cart' : 'Add to cart'}
        >
          <img src="/images/cart.png" alt="" aria-hidden="true" />
        </button>
      </div>

      <div className="d-flex flex-column flex-grow-1">
        <p className="fw-bold fs-5 text-dark mb-1">
          {Number(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
        </p>
        <h6 className="fw-bold text-dark mb-0">
          {product.desc || product.title || product.name}
        </h6>
      </div>
    </div>
  );
};

export default ProductCard;