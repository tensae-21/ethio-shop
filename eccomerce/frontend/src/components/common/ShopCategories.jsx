import shopCatalog from '../../data/shopCatalog.json';
import { useState } from 'react';
//import ProductDetail from './ProductDetail';
import ProductDetail from '../product/ProductDetail';

const shopCategoryStyles = `
  .category-card {
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    background: #ffffff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: block;
    height: 100%;
  }
  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
  }
  .category-img-wrapper {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: relative;
    cursor: pointer;
  }
  .category-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    transition: transform 0.4s ease;
  }
  .category-img-wrapper:hover .category-img {
    transform: scale(1.08);
  }
  .product-item-card {
    border-radius: 0.85rem;
    overflow: hidden;
    border: 1px solid #eaeaea;
    background: #ffffff;
    transition: all 0.25s ease;
    cursor: pointer;
  }
  .product-item-card:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    border-color: #ffc107;
  }
  .add-to-cart-btn-yellow {
    background-color: #ffc107;
    color: #000000;
    font-weight: 600;
    font-size: 0.75rem;
    border: none;
    border-radius: 0.4rem;
    padding: 5px 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s ease, transform 0.1s ease;
    cursor: pointer;
    white-space: nowrap;
  }
  .add-to-cart-btn-yellow:hover {
    background-color: #ffcd39;
    color: #000000;
  }
  .add-to-cart-btn-yellow:active {
    transform: scale(0.96);
  }
  .rating-star-icon {
    color: #ffc107;
    font-size: 0.72rem;
  }
`;

export default function ShopCategories({ selectedCategory, setSelectedCategory, onAddToCart }) {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryData = shopCatalog;

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  // Render Product Detail Screen if a product is selected
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        categoryKey={selectedCategory}
        categoryTitle={categoryData[selectedCategory]?.title}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <>
      <style>{shopCategoryStyles}</style>
      <section className="container-fluid px-3 px-lg-4 py-3">
        
        {/* Category List View */}
        {!selectedCategory ? (
          <>
            <div className="row mb-2">
              <div className="col-12 text-start ps-1">
                <h2 className="fw-semibold text-dark m-0 fs-5">Shop by Categories</h2>
              </div>
            </div>

            <div className="row g-3">
              {Object.keys(categoryData).map((key) => {
                const cat = categoryData[key];
                const imageId = `cat-cover-${key}`;
                return (
                  <div className="col-6 col-md-3" key={key}>
                    <div 
                      className="category-card" 
                      onClick={() => setSelectedCategory(key)}
                    >
                      <div className="category-img-wrapper">
                        {imageErrors[imageId] ? (
                          <div className="d-flex align-items-center justify-content-center h-100 text-muted bg-white w-100">
                            <i className="fa-solid fa-image fs-1"></i>
                          </div>
                        ) : (
                          <img 
                            src={cat.coverImage} 
                            alt={cat.title} 
                            className="category-img"
                            onError={() => handleImageError(imageId)}
                          />
                        )}
                      </div>
                      <div className="p-3 text-start d-flex justify-content-between align-items-center border-top">
                        <h6 className="fw-normal text-dark mb-0">{cat.title}</h6>
                        <span className="small text-danger fw-semibold">
                          <i className="fa-solid fa-arrow-right small"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Detailed Category Grid */
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="text-start ps-1">
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className="btn btn-outline-danger btn-sm mb-2 rounded-pill px-3 fw-semibold"
                >
                  <i className="fa-solid fa-arrow-left me-1"></i> Back to Categories
                </button>
                <h2 className="fw-semibold text-dark m-0 fs-5">{categoryData[selectedCategory].title}</h2>
              </div>
            </div>

            <div className="row g-3">
              {categoryData[selectedCategory].images.map((item, idx) => {
                const itemImageId = `cat-item-${selectedCategory}-${idx}`;
                return (
                  <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={item.id || idx}>
                    <div 
                      className="product-item-card h-100 d-flex flex-column justify-content-between"
                      onClick={() => setSelectedProduct(item)}
                    >
                      
                      {/* Image Box */}
                      <div className="category-img-wrapper">
                        {imageErrors[itemImageId] ? (
                          <div className="d-flex align-items-center justify-content-center h-100 text-muted bg-white w-100">
                            <i className="fa-solid fa-image fs-3"></i>
                          </div>
                        ) : (
                          <img 
                            src={item.path} 
                            alt={item.name} 
                            className="category-img"
                            onError={() => handleImageError(itemImageId)}
                          />
                        )}
                        <button
                          type="button"
                          className="product-cart-button"
                          title={`Add ${item.name} to cart`}
                          aria-label={`Add ${item.name} to cart`}
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          <img src="/images/cart.png" alt="" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Details Box */}
                      <div className="p-2 text-start border-top bg-white flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                          {selectedCategory === 'accessories' && item.gram && (
                            <div className="mb-1 text-end">
                              <span className="badge bg-light text-dark border" style={{ fontSize: '0.65rem' }}>
                                {item.gram}
                              </span>
                            </div>
                          )}

                          <p className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>
                            {Number(item.price || 0).toLocaleString()} ETB
                          </p>
                          <h6 className="fw-normal text-dark mb-1 text-wrap" style={{ fontSize: '0.82rem' }} title={item.name}>
                            {item.name}
                          </h6>
                          <div className="d-flex align-items-center gap-1">
                            <i className="fa-solid fa-star rating-star-icon"></i>
                            <span className="fw-semibold text-dark" style={{ fontSize: '0.7rem' }}>
                              {item.rating}
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </section>
    </>
  );
}