import React, { useState } from 'react';

const productDetailStyles = `
  .product-detail-img-container {
    width: 100%;
    height: 380px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    border: 1px solid #eaeaea;
    overflow: hidden;
  }
  .product-detail-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .badge-category {
    font-size: 0.75rem;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
  }
  .btn-yellow-add-cart {
    background-color: #ffc107;
    color: #000000;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    padding: 10px 24px;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 193, 7, 0.3);
  }
  .btn-yellow-add-cart:hover {
    background-color: #ffcd39;
    color: #000000;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
    transform: translateY(-1px);
  }
  .btn-yellow-add-cart:active {
    transform: scale(0.97);
  }

  /* Yellow Quantity Buttons */
  .qty-btn-yellow {
    border: none;
    background-color: #ffc107;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #000000;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  .qty-btn-yellow:hover {
    background-color: #ffcd39;
  }
  .qty-btn-yellow:active {
    background-color: #e0a800;
    transform: scale(0.95);
  }

  .qty-display {
    min-width: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 1rem;
    color: #212529;
  }
`;

export default function ProductDetail({ product, categoryKey, categoryTitle, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Dynamic specs based on category type
  const getProductSpecs = () => {
    if (categoryKey === 'accessories') {
      return {
        brand: "Luxe Accessories",
        weight: product?.gram || "45g",
        material: "Premium Metal / Synthetic Blend",
        dimensions: "Standard Unisex Fit",
        warranty: "1 Year Limited Warranty",
        description: "Elevate your daily attire with this finely crafted accessory. Engineered for style, comfort, and durability using high-grade hypoallergenic materials."
      };
    }

    return {
      brand: "Urban Thread Co.",
      material: "100% Breathable Organic Cotton",
      fit: "Regular Standard Fit",
      care: "Machine wash cold, tumble dry low",
      warranty: "30-Day Quality Guarantee",
      description: "Designed for all-day comfort and casual elegance. Crafted with premium soft fabric featuring reinforced stitching for long-lasting everyday wear."
    };
  };

  const specs = getProductSpecs();

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart({ ...product, quantity });
    }
  };

  return (
    <>
      <style>{productDetailStyles}</style>
      <div className="container-fluid px-3 px-lg-4 py-3 text-start">
        
        {/* Navigation & Breadcrumb */}
        <div className="mb-4">
          <button 
            onClick={onBack} 
            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold me-2"
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Back to Products
          </button>
          <span className="text-muted small">
            {categoryTitle} / <strong className="text-dark">{product?.name}</strong>
          </span>
        </div>

        <div className="row g-4">
          
          {/* Left Column: Image Preview */}
          <div className="col-12 col-md-5">
            <div className="product-detail-img-container shadow-sm p-3">
              {imageError ? (
                <div className="text-center text-muted">
                  <i className="fa-solid fa-image fs-1 mb-2"></i>
                  <p className="small m-0">Image preview unavailable</p>
                </div>
              ) : (
                <img 
                  src={product?.path} 
                  alt={product?.name} 
                  className="product-detail-img"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </div>

          {/* Right Column: Details and Actions */}
          <div className="col-12 col-md-7 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge-category">{categoryTitle}</span>
                <span className="text-muted small">Brand: <strong>{specs.brand}</strong></span>
              </div>

              <h2 className="fw-bold text-dark fs-3 mb-2">{product?.name}</h2>

              {/* Rating & Stock */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-1 text-warning fs-6">
                  <i className="fa-solid fa-star"></i>
                  <span className="fw-bold text-dark">{product?.rating}</span>
                </div>
                <span className="text-muted">|</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">In Stock</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="fs-2 fw-bold text-dark">{product?.price?.toLocaleString()} ETB</span>
                <span className="text-muted small ms-2">(Inclusive of all taxes)</span>
              </div>

              {/* Specifications Table */}
              <div className="bg-light p-3 rounded-3 mb-4">
                <h6 className="fw-bold text-dark mb-2 fs-6">Product Details</h6>
                <table className="table table-borderless table-sm m-0 small">
                  <tbody>
                    {categoryKey === 'accessories' ? (
                      <>
                        <tr>
                          <td className="text-muted ps-0" style={{ width: '130px' }}>Item Weight / Gram:</td>
                          <td className="fw-semibold text-dark">{specs.weight}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Material Specs:</td>
                          <td className="fw-semibold text-dark">{specs.material}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Dimensions/Fit:</td>
                          <td className="fw-semibold text-dark">{specs.dimensions}</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td className="text-muted ps-0" style={{ width: '130px' }}>Fabric / Material:</td>
                          <td className="fw-semibold text-dark">{specs.material}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Sizing & Fit:</td>
                          <td className="fw-semibold text-dark">{specs.fit}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Care Instructions:</td>
                          <td className="fw-semibold text-dark">{specs.care}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td className="text-muted ps-0">Warranty:</td>
                      <td className="fw-semibold text-dark">{specs.warranty}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-1 fs-6">Description</h6>
                <p className="text-secondary small leading-relaxed m-0">{specs.description}</p>
              </div>
            </div>

            {/* Quantity Selector & Yellow Add To Cart Button */}
            <div className="pt-3 border-top d-flex align-items-center gap-3">
              
              {/* Yellow Quantity Counter Controls */}
              <div className="d-flex align-items-center border border-warning rounded-3 bg-white overflow-hidden shadow-sm">
                
                {/* Yellow Decrease (-) Button */}
                <button 
                  type="button"
                  className="qty-btn-yellow"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  title="Decrease Quantity"
                >
                  <i className="fa-solid fa-minus small"></i>
                </button>
                
                <span className="qty-display px-2">{quantity}</span>
                
                {/* Yellow Increase (+) Button */}
                <button 
                  type="button"
                  className="qty-btn-yellow"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  title="Increase Quantity"
                >
                  <i className="fa-solid fa-plus small"></i>
                </button>
              </div>

              {/* Yellow Add to Cart Button */}
              <button 
                type="button"
                className="btn-yellow-add-cart" 
                onClick={handleAddToCart}
              >
                <i className="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}