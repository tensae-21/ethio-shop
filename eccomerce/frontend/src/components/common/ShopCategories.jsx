import React, { useState } from 'react';
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

  const categoryData = {
    men: {
      title: "Men's Clothing",
      coverImage: "/images/categories/men/shirt.png",
      images: [
        { path: "/images/categories/men/black t shirt.png", price: 850, name: "Black Cotton T-Shirt", rating: 4.8 },
        { path: "/images/categories/men/brand shoes.png", price: 4200, name: "Athletic Sneakers", rating: 4.9 },
        { path: "/images/categories/men/brand shoes2.png", price: 4500, name: "Sport Running Shoes", rating: 4.7 },
        { path: "/images/categories/men/hoodies.png", price: 2300, name: "Fleece Pullover Hoodie", rating: 4.6 },
        { path: "/images/categories/men/hoodies2.png", price: 2450, name: "Street Style Hoodie", rating: 4.5 },
        { path: "/images/categories/men/hoodies3.png", price: 2500, name: "Casual Hooded Sweatshirt", rating: 4.8 },
        { path: "/images/categories/men/jacket.png", price: 3800, name: "Windproof Zip Jacket", rating: 4.9 },
        { path: "/images/categories/men/jacket1.png", price: 3950, name: "Thermal Winter Coat", rating: 4.8 },
        { path: "/images/categories/men/jacket2.png", price: 4100, name: "Smart Casual Jacket", rating: 4.7 },
        { path: "/images/categories/men/jeans.png", price: 2100, name: "Slim Fit Blue Jeans", rating: 4.6 },
        { path: "/images/categories/men/jeans2.png", price: 2200, name: "Dark Wash Straight Denim", rating: 4.5 },
        { path: "/images/categories/men/jeans3.png", price: 2250, name: "Relaxed Fit Denim", rating: 4.4 },
        { path: "/images/categories/men/jeans4.png", price: 2300, name: "Washed Denim Trousers", rating: 4.6 },
        { path: "/images/categories/men/shirt.png", price: 1800, name: "Formal Button-Down Shirt", rating: 4.8 },
        { path: "/images/categories/men/shirt2.png", price: 1850, name: "Casual Long Sleeve Shirt", rating: 4.7 },
        { path: "/images/categories/men/shirt3.png", price: 1900, name: "Slim Fit Dress Shirt", rating: 4.9 },
        { path: "/images/categories/men/shirt4.png", price: 1950, name: "Cotton Button Shirt", rating: 4.6 },
        { path: "/images/categories/men/shirt6.png", price: 2000, name: "Short Sleeve Shirt", rating: 4.5 },
        { path: "/images/categories/men/shirt8.png", price: 2050, name: "Premium Woven Shirt", rating: 4.8 },
        { path: "/images/categories/men/shoes for men.png", price: 3600, name: "Leather Formal Shoes", rating: 4.9 },
        { path: "/images/categories/men/shoes.png", price: 3200, name: "Low-Top Casual Sneakers", rating: 4.7 },
        { path: "/images/categories/men/shoes1.png", price: 3300, name: "Walking Sneakers", rating: 4.6 },
        { path: "/images/categories/men/shoes2.png", price: 3400, name: "Urban Active Footwear", rating: 4.8 },
        { path: "/images/categories/men/shoes3.png", price: 3500, name: "Slip-On Loafers", rating: 4.7 },
        { path: "/images/categories/men/shoes4.png", price: 3550, name: "Outdoor Cross Trainers", rating: 4.9 },
        { path: "/images/categories/men/t shirt.png", price: 900, name: "Crew Neck Cotton Tee", rating: 4.5 },
        { path: "/images/categories/men/t shirt2.png", price: 950, name: "Athletic Fit Tee", rating: 4.6 },
        { path: "/images/categories/men/t shirt3.png", price: 980, name: "Graphic Print T-Shirt", rating: 4.7 },
        { path: "/images/categories/men/t shirt4.png", price: 1000, name: "Solid Color Crew Tee", rating: 4.4 },
        { path: "/images/categories/men/white t shirt.png", price: 850, name: "White Cotton T-Shirt", rating: 4.8 }
      ]
    },
    women: {
      title: "Women's Clothing",
      coverImage: "/images/categories/women/fashion women.png",
      images: [
        { path: "/images/categories/women/dress.png", price: 2800, name: "Evening Gown Dress", rating: 4.9 },
        { path: "/images/categories/women/dress1.png", price: 2950, name: "Floral Summer Midi Dress", rating: 4.8 },
        { path: "/images/categories/women/dress2.png", price: 3100, name: "Casual Daily Wear Dress", rating: 4.6 },
        { path: "/images/categories/women/dress3.png", price: 3300, name: "Cocktail Party Dress", rating: 4.9 },
        { path: "/images/categories/women/fashion women.png", price: 3500, name: "High Fashion Ensemble", rating: 4.8 },
        { path: "/images/categories/women/jacket.png", price: 3600, name: "Cropped Zip Jacket", rating: 4.7 },
        { path: "/images/categories/women/jacket1.png", price: 3750, name: "Fleece Winter Coat", rating: 4.9 },
        { path: "/images/categories/women/jacket3.png", price: 3900, name: "Lightweight Spring Jacket", rating: 4.6 },
        { path: "/images/categories/women/jeans.png", price: 2200, name: "High-Waisted Stretch Jeans", rating: 4.8 },
        { path: "/images/categories/women/jeans1.png", price: 2300, name: "Slim Fit Blue Denim", rating: 4.7 },
        { path: "/images/categories/women/jeans2.png", price: 2350, name: "Relaxed Leg Denim Pants", rating: 4.5 },
        { path: "/images/categories/women/jeans3.png", price: 2400, name: "Skinny Fit Dark Wash Denim", rating: 4.6 },
        { path: "/images/categories/women/TD deraro.png", price: 5500, name: "Traditional Habesha Dress", rating: 5.0 },
        { path: "/images/categories/women/TD.png", price: 5200, name: "Ethiopian Cultural Attire", rating: 4.9 },
        { path: "/images/categories/women/TD1.png", price: 5800, name: "Elegant Habesha Kemis", rating: 5.0 },
        { path: "/images/categories/women/tradational.png", price: 6000, name: "Handmade Ethiopian Dress", rating: 5.0 },
        { path: "/images/categories/women/W hoodies.png", price: 2300, name: "Cropped Sweater Hoodie", rating: 4.7 },
        { path: "/images/categories/women/W hoodies2.png", price: 2400, name: "Oversized Pullover Hoodie", rating: 4.8 },
        { path: "/images/categories/women/W hoodies4.png", price: 2500, name: "Fleece Sweatshirt", rating: 4.6 },
        { path: "/images/categories/women/W shoes.png", price: 2900, name: "Daily Walking Sneakers", rating: 4.7 },
        { path: "/images/categories/women/W shoes1.png", price: 3100, name: "Low-Top Sneakers", rating: 4.8 },
        { path: "/images/categories/women/W shoes2.png", price: 3200, name: "High Heel Dress Shoes", rating: 4.9 },
        { path: "/images/categories/women/W shoes3.png", price: 3300, name: "Sport Running Shoes", rating: 4.7 },
        { path: "/images/categories/women/W shoes4.png", price: 3400, name: "Leather Flat Casual Shoes", rating: 4.6 }
      ]
    },
    kids: {
      title: "Kids' Clothing",
      coverImage: "/images/categories/kids/dress.png",
      images: [
        { path: "/images/categories/kids/dress.png", price: 1400, name: "Cotton Party Dress", rating: 4.8 },
        { path: "/images/categories/kids/dress1.png", price: 1500, name: "Casual Summer Dress", rating: 4.7 },
        { path: "/images/categories/kids/kid dress.png", price: 1450, name: "Printed Toddler Dress", rating: 4.9 },
        { path: "/images/categories/kids/kid dress1.png", price: 1550, name: "Floral Birthday Frock", rating: 4.8 },
        { path: "/images/categories/kids/kid dress2.png", price: 1600, name: "Party Dress for Girls", rating: 4.7 },
        { path: "/images/categories/kids/kid dress3.png", price: 1650, name: "Cotton Summer Frock", rating: 4.6 },
        { path: "/images/categories/kids/kid shoes.png", price: 1800, name: "Non-Slip Athletic Sneakers", rating: 4.9 },
        { path: "/images/categories/kids/kid shoes1.png", price: 1850, name: "Soft Cushioned Shoes", rating: 4.8 },
        { path: "/images/categories/kids/kid shoes2.png", price: 1900, name: "Outdoor Play Sneakers", rating: 4.7 },
        { path: "/images/categories/kids/kid shoes3.png", price: 1950, name: "Velcro Strap Kid Shoes", rating: 4.8 },
        { path: "/images/categories/kids/kid shoes4.png", price: 2000, name: "Daily Casual Sneakers", rating: 4.6 },
        { path: "/images/categories/kids/kid shoes5.png", price: 2050, name: "Active Kids Footwear", rating: 4.7 },
        { path: "/images/categories/kids/kid t shirt 3.png", price: 650, name: "Cartoon Printed Cotton Tee", rating: 4.9 },
        { path: "/images/categories/kids/kid t shirt.png", price: 600, name: "Basic Daily Kids T-Shirt", rating: 4.5 },
        { path: "/images/categories/kids/kid t shirt1.png", price: 620, name: "Short Sleeve Cotton Shirt", rating: 4.6 },
        { path: "/images/categories/kids/kid t shirt2.png", price: 640, name: "Vibrant Graphic Cotton Tee", rating: 4.7 }
      ]
    },
    accessories: {
      title: "Accessories",
      coverImage: "/images/categories/accessory/watches.png",
      images: [
        { path: "/images/categories/accessory/bracelate.png", price: 850, gram: "50g", name: "Beaded Wrist Bracelet", rating: 4.7 },
        { path: "/images/categories/accessory/bracelate1.png", price: 900, gram: "60g", name: "Metallic Charm Bracelet", rating: 4.6 },
        { path: "/images/categories/accessory/bracelate2.png", price: 950, gram: "55g", name: "Adjustable Wrist Band", rating: 4.5 },
        { path: "/images/categories/accessory/bracelate3.png", price: 1000, gram: "65g", name: "Silver-Plated Bracelet", rating: 4.8 },
        { path: "/images/categories/accessory/bracelate5.png", price: 1100, gram: "70g", name: "Leather Wristband", rating: 4.7 },
        { path: "/images/categories/accessory/eye glass.png", price: 1500, gram: "40g", name: "Anti-Blue Light Spectacles", rating: 4.9 },
        { path: "/images/categories/accessory/glass.png", price: 1400, gram: "45g", name: "Designer Sunglasses", rating: 4.8 },
        { path: "/images/categories/accessory/glass1.png", price: 1450, gram: "42g", name: "Polarized Lenses", rating: 4.7 },
        { path: "/images/categories/accessory/glass2.png", price: 1600, gram: "48g", name: "Aviator Sunglasses", rating: 4.9 },
        { path: "/images/categories/accessory/jewelary.png", price: 2100, gram: "110g", name: "Formal Wear Jewelry Set", rating: 4.8 },
        { path: "/images/categories/accessory/jewellary.png", price: 2200, gram: "120g", name: "Pendant & Earring Set", rating: 4.9 },
        { path: "/images/categories/accessory/jewwlary.png", price: 2300, gram: "130g", name: "Handcrafted Silver Jewelry", rating: 5.0 },
        { path: "/images/categories/accessory/necklace.png", price: 1800, gram: "30g", name: "Pendant Chain Necklace", rating: 4.7 },
        { path: "/images/categories/accessory/necklace1.png", price: 1900, gram: "35g", name: "Layered Chain Necklace", rating: 4.8 },
        { path: "/images/categories/accessory/necklace2.png", price: 2000, gram: "38g", name: "Stone-Embedded Necklace", rating: 4.7 },
        { path: "/images/categories/accessory/necklace3.png", price: 2100, gram: "32g", name: "Minimalist Neckwear", rating: 4.6 },
        { path: "/images/categories/accessory/necklace4.png", price: 2200, gram: "40g", name: "Silver Pendant Necklace", rating: 4.8 },
        { path: "/images/categories/accessory/watches.png", price: 3200, gram: "150g", name: "Analog Leather Watch", rating: 4.9 },
        { path: "/images/categories/accessory/watches1.png", price: 3500, gram: "180g", name: "Stainless Steel Watch", rating: 4.9 },
        { path: "/images/categories/accessory/watches2.png", price: 3800, gram: "160g", name: "Digital Smart Watch", rating: 4.8 }
      ]
    }
  };

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
                  <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={idx}>
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

                          {/* Product Name */}
                          <h6 className="fw-normal text-dark mb-1 text-truncate" style={{ fontSize: '0.82rem' }} title={item.name}>
                            {item.name}
                          </h6>

                          {/* Star Rating Indicator */}
                          <div className="d-flex align-items-center gap-1 mb-2">
                            <i className="fa-solid fa-star rating-star-icon"></i>
                            <span className="fw-semibold text-dark" style={{ fontSize: '0.7rem' }}>
                              {item.rating}
                            </span>
                          </div>
                        </div>

                        {/* Price and Yellow Add to Cart Button Side-by-Side */}
                        <div className="d-flex align-items-center justify-content-between pt-1 border-top">
                          <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                            {item.price.toLocaleString()} ETB
                          </span>

                          <button 
                            className="add-to-cart-btn-yellow" 
                            title="Add to Cart"
                            onClick={(e) => handleAddToCart(e, item)}
                          >
                            <i className="fa-solid fa-cart-shopping"></i> Add
                          </button>
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