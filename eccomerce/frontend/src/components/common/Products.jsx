import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const Products = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState('');
  
  // State for Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Active category & sub-item state (defaults to 'women' / 'Dresses')
  const activeCategory = searchParams.get('category') || 'women';
  const activeItem = searchParams.get('item') || 'Dresses';
  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase();

  // Price Range Filter State
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Main Sidebar Collapsible Sections State
  const [isCategoriesSectionOpen, setIsCategoriesSectionOpen] = useState(true);
  const [isPriceSectionOpen, setIsPriceSectionOpen] = useState(true);

  // Individual Category Dropdowns State
  const [openCategories, setOpenCategories] = useState({
    women: activeCategory.toLowerCase() === 'women',
    men: activeCategory.toLowerCase() === 'men',
    kids: activeCategory.toLowerCase() === 'kids',
    accessories: activeCategory.toLowerCase() === 'accessories'
  });

  const toggleCategory = (catKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // Structured Sidebar Categories & Specific Sub-Items
  const sidebarCategories = [
    {
      key: 'women',
      title: 'Women',
      items: ['Dresses', 'Traditional clothes', 'Jeans', 'Jackets', 'Hoodies', 'Shoes']
    },
    {
      key: 'men',
      title: 'Men',
      items: ['T-Shirts', 'Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Shoes']
    },
    {
      key: 'kids',
      title: 'Kids',
      items: ['T-Shirts', 'Dresses', 'Shoes']
    },
    {
      key: 'accessories',
      title: 'Accessories',
      items: ['Watches', 'Sunglasses', 'Jewelry', 'Bracelets', 'Necklaces']
    }
  ];

  // Price Range Options
  const priceRanges = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'r1', label: '0 - 500 Birr', min: 0, max: 500 },
    { id: 'r2', label: '501 - 1,000 Birr', min: 501, max: 1000 },
    { id: 'r3', label: '1,001 - 3,000 Birr', min: 1001, max: 3000 },
    { id: 'r4', label: '3,001 - 5,000 Birr', min: 3001, max: 5000 },
    { id: 'r5', label: '5,001 - 10,000 Birr', min: 5001, max: 10000 },
    { id: 'r6', label: 'Above 10,000 Birr', min: 10001, max: Infinity }
  ];

  // Product Dataset categorized strictly by sub-item category
  const categoryData = {
    men: [
      { id: 'm1', path: "/images/categories/men/black t shirt.png", price: 850, desc: "Breathable pure black cotton t-shirt.", item: "T-Shirts" },
      { id: 'm2', path: "/images/categories/men/t shirt.png", price: 900, desc: "Classic crew neck cotton t-shirt.", item: "T-Shirts" },
      { id: 'm3', path: "/images/categories/men/t shirt2.png", price: 950, desc: "Athletic fit crew neck tee.", item: "T-Shirts" },
      { id: 'm4', path: "/images/categories/men/t shirt3.png", price: 980, desc: "Casual graphic print cotton t-shirt.", item: "T-Shirts" },
      { id: 'm5', path: "/images/categories/men/t shirt4.png", price: 1000, desc: "Fitted solid color crew tee.", item: "T-Shirts" },
      { id: 'm6', path: "/images/categories/men/white t shirt.png", price: 850, desc: "Essential pure white cotton t-shirt.", item: "T-Shirts" },
      { id: 'm7', path: "/images/categories/men/shirt.png", price: 1800, desc: "Crisp formal button-down shirt.", item: "Shirts" },
      { id: 'm8', path: "/images/categories/men/shirt2.png", price: 1850, desc: "Casual long sleeve cotton shirt.", item: "Shirts" },
      { id: 'm9', path: "/images/categories/men/shirt3.png", price: 1900, desc: "Slim fit plain dress shirt.", item: "Shirts" },
      { id: 'm10', path: "/images/categories/men/shirt4.png", price: 1950, desc: "Trendy semi-formal cotton button shirt.", item: "Shirts" },
      { id: 'm11', path: "/images/categories/men/shirt6.png", price: 2000, desc: "Lightweight summer short sleeve shirt.", item: "Shirts" },
      { id: 'm12', path: "/images/categories/men/shirt8.png", price: 2050, desc: "Premium woven long sleeve shirt.", item: "Shirts" },
      { id: 'm13', path: "/images/categories/men/jeans.png", price: 2100, desc: "Stretch slim fit blue denim jeans.", item: "Jeans" },
      { id: 'm14', path: "/images/categories/men/jeans2.png", price: 2200, desc: "Classic dark wash straight denim.", item: "Jeans" },
      { id: 'm15', path: "/images/categories/men/jeans3.png", price: 2250, desc: "Relaxed fit daily casual denim.", item: "Jeans" },
      { id: 'm16', path: "/images/categories/men/jeans4.png", price: 2300, desc: "Durable washed denim trousers.", item: "Jeans" },
      { id: 'm17', path: "/images/categories/men/hoodies.png", price: 2300, desc: "Warm fleece pullover hoodie sweater.", item: "Hoodies" },
      { id: 'm18', path: "/images/categories/men/hoodies2.png", price: 2450, desc: "Heavyweight street style cotton hoodie.", item: "Hoodies" },
      { id: 'm19', path: "/images/categories/men/hoodies3.png", price: 2500, desc: "Soft insulated casual hooded sweatshirt.", item: "Hoodies" },
      { id: 'm20', path: "/images/categories/men/jacket.png", price: 3800, desc: "Windproof zip front outerwear jacket.", item: "Jackets" },
      { id: 'm21', path: "/images/categories/men/jacket1.png", price: 3950, desc: "Thermal insulated warm winter coat.", item: "Jackets" },
      { id: 'm22', path: "/images/categories/men/jacket2.png", price: 4100, desc: "Tailored smart casual autumn jacket.", item: "Jackets" },
      { id: 'm23', path: "/images/categories/men/brand shoes.png", price: 4200, desc: "Cushioned athletic rubber sole sneakers.", item: "Shoes" },
      { id: 'm24', path: "/images/categories/men/brand shoes2.png", price: 4500, desc: "High-traction durable running sport shoes.", item: "Shoes" },
      { id: 'm25', path: "/images/categories/men/shoes for men.png", price: 3600, desc: "Polished leather formal dress shoes.", item: "Shoes" },
      { id: 'm26', path: "/images/categories/men/shoes.png", price: 3200, desc: "Low-top comfortable casual sneakers.", item: "Shoes" },
      { id: 'm27', path: "/images/categories/men/shoes1.png", price: 3300, desc: "Breathable lifestyle walking sneakers.", item: "Shoes" },
      { id: 'm28', path: "/images/categories/men/shoes2.png", price: 3400, desc: "Supportive urban active footwear.", item: "Shoes" },
      { id: 'm29', path: "/images/categories/men/shoes3.png", price: 3500, desc: "Smart casual slip-on loafers.", item: "Shoes" },
      { id: 'm30', path: "/images/categories/men/shoes4.png", price: 3550, desc: "Heavy-duty outdoor cross training shoes.", item: "Shoes" }
    ],
    women: [
      { id: 'w1', path: "/images/categories/women/dress.png", price: 2800, desc: "Elegant fitting evening gown dress.", item: "Dresses" },
      { id: 'w2', path: "/images/categories/women/dress1.png", price: 2950, desc: "Flowy floral summer midi dress.", item: "Dresses" },
      { id: 'w3', path: "/images/categories/women/dress2.png", price: 3100, desc: "Casual comfortable daily wearable dress.", item: "Dresses" },
      { id: 'w4', path: "/images/categories/women/dress3.png", price: 3300, desc: "Sophisticated cocktail party dress.", item: "Dresses" },
      { id: 'w5', path: "/images/categories/women/fashion women.png", price: 3500, desc: "Trendy high fashion ensemble.", item: "Dresses" },
      { id: 'w6', path: "/images/categories/women/TD deraro.png", price: 5500, desc: "Handwoven traditional Habesha cultural dress.", item: "Traditional clothes" },
      { id: 'w7', path: "/images/categories/women/TD.png", price: 5200, desc: "Embroidered authentic Ethiopian cultural attire.", item: "Traditional clothes" },
      { id: 'w8', path: "/images/categories/women/TD1.png", price: 5800, desc: "Custom woven elegant Habesha Kemis.", item: "Traditional clothes" },
      { id: 'w9', path: "/images/categories/women/tradational.png", price: 6000, desc: "Handmade traditional Ethiopian dress.", item: "Traditional clothes" },
      { id: 'w10', path: "/images/categories/women/jeans.png", price: 2200, desc: "High-waisted stretch denim jeans.", item: "Jeans" },
      { id: 'w11', path: "/images/categories/women/jeans1.png", price: 2300, desc: "Slim fit blue female denim.", item: "Jeans" },
      { id: 'w12', path: "/images/categories/women/jeans2.png", price: 2350, desc: "Relaxed leg comfortable denim pants.", item: "Jeans" },
      { id: 'w13', path: "/images/categories/women/jeans3.png", price: 2400, desc: "Skinny fit dark wash denim.", item: "Jeans" },
      { id: 'w14', path: "/images/categories/women/jacket.png", price: 3600, desc: "Chic cropped zip outerwear jacket.", item: "Jackets" },
      { id: 'w15', path: "/images/categories/women/jacket1.png", price: 3750, desc: "Warm cozy fleece winter coat.", item: "Jackets" },
      { id: 'w16', path: "/images/categories/women/jacket3.png", price: 3900, desc: "Lightweight spring outerwear jacket.", item: "Jackets" },
      { id: 'w17', path: "/images/categories/women/W hoodies.png", price: 2300, desc: "Cozy fleece cropped sweater hoodie.", item: "Hoodies" },
      { id: 'w18', path: "/images/categories/women/W hoodies2.png", price: 2400, desc: "Oversized soft pullover hoodie.", item: "Hoodies" },
      { id: 'w19', path: "/images/categories/women/W hoodies4.png", price: 2500, desc: "Warm fleece sweatshirt with drawstrings.", item: "Hoodies" },
      { id: 'w20', path: "/images/categories/women/W shoes.png", price: 2900, desc: "Comfortable daily walking sneakers.", item: "Shoes" },
      { id: 'w21', path: "/images/categories/women/W shoes1.png", price: 3100, desc: "Trendy low-top female sneakers.", item: "Shoes" },
      { id: 'w22', path: "/images/categories/women/W shoes2.png", price: 3200, desc: "Elegant high heel dress shoes.", item: "Shoes" },
      { id: 'w23', path: "/images/categories/women/W shoes3.png", price: 3300, desc: "Lightweight sport running shoes.", item: "Shoes" },
      { id: 'w24', path: "/images/categories/women/W shoes4.png", price: 3400, desc: "Leather flat daily casual shoes.", item: "Shoes" }
    ],
    kids: [
      { id: 'k1', path: "/images/categories/kids/kid t shirt.png", price: 600, desc: "Basic comfortable daily kids t-shirt.", item: "T-Shirts" },
      { id: 'k2', path: "/images/categories/kids/kid t shirt1.png", price: 620, desc: "Soft short sleeve cotton shirt.", item: "T-Shirts" },
      { id: 'k3', path: "/images/categories/kids/kid t shirt2.png", price: 640, desc: "Vibrant graphic cotton tee.", item: "T-Shirts" },
      { id: 'k4', path: "/images/categories/kids/kid t shirt 3.png", price: 650, desc: "Cartoon printed pure cotton tee.", item: "T-Shirts" },
      { id: 'k5', path: "/images/categories/kids/dress.png", price: 1400, desc: "Cute cotton party dress for kids.", item: "Dresses" },
      { id: 'k6', path: "/images/categories/kids/dress1.png", price: 1500, desc: "Breathable casual summer dress.", item: "Dresses" },
      { id: 'k7', path: "/images/categories/kids/kid dress.png", price: 1450, desc: "Printed princess toddler dress.", item: "Dresses" },
      { id: 'k8', path: "/images/categories/kids/kid dress1.png", price: 1550, desc: "Floral pattern birthday frock.", item: "Dresses" },
      { id: 'k9', path: "/images/categories/kids/kid dress2.png", price: 1600, desc: "Charming party dress for girls.", item: "Dresses" },
      { id: 'k10', path: "/images/categories/kids/kid dress3.png", price: 1650, desc: "Lightweight cotton summer frock.", item: "Dresses" },
      { id: 'k11', path: "/images/categories/kids/kid shoes.png", price: 1800, desc: "Non-slip athletic kids sneakers.", item: "Shoes" },
      { id: 'k12', path: "/images/categories/kids/kid shoes1.png", price: 1850, desc: "Soft cushioned walking shoes.", item: "Shoes" },
      { id: 'k13', path: "/images/categories/kids/kid shoes2.png", price: 1900, desc: "Lightweight outdoor play sneakers.", item: "Shoes" },
      { id: 'k14', path: "/images/categories/kids/kid shoes3.png", price: 1950, desc: "Velcro strap active kid shoes.", item: "Shoes" },
      { id: 'k15', path: "/images/categories/kids/kid shoes4.png", price: 2000, desc: "Casual daily sneakers for children.", item: "Shoes" },
      { id: 'k16', path: "/images/categories/kids/kid shoes5.png", price: 2050, desc: "Flexible breathable active footwear.", item: "Shoes" }
    ],
    accessories: [
      { id: 'a1', path: "/images/categories/accessory/watches.png", price: 3200, gram: "150g", desc: "Analog wrist watch with leather strap.", item: "Watches" },
      { id: 'a2', path: "/images/categories/accessory/watches1.png", price: 3500, gram: "180g", desc: "Water-resistant stainless steel watch.", item: "Watches" },
      { id: 'a3', path: "/images/categories/accessory/watches2.png", price: 3800, gram: "160g", desc: "Digital smart watch display.", item: "Watches" },
      { id: 'a4', path: "/images/categories/accessory/eye glass.png", price: 1500, gram: "40g", desc: "Anti-blue light clear spectacle frames.", item: "Sunglasses" },
      { id: 'a5', path: "/images/categories/accessory/glass.png", price: 1400, gram: "45g", desc: "UV protection designer sunglasses.", item: "Sunglasses" },
      { id: 'a6', path: "/images/categories/accessory/glass1.png", price: 1450, gram: "42g", desc: "Polarized sun protection lenses.", item: "Sunglasses" },
      { id: 'a7', path: "/images/categories/accessory/glass2.png", price: 1600, gram: "48g", desc: "Classic aviator style sunglasses.", item: "Sunglasses" },
      { id: 'a8', path: "/images/categories/accessory/jewelary.png", price: 2100, gram: "110g", desc: "Exquisite formal wear jewelry set.", item: "Jewelry" },
      { id: 'a9', path: "/images/categories/accessory/jewellary.png", price: 2200, gram: "120g", desc: "Crystal pendant and earring set.", item: "Jewelry" },
      { id: 'a10', path: "/images/categories/accessory/jewwlary.png", price: 2300, gram: "130g", desc: "Traditional silver handcrafted jewelry.", item: "Jewelry" },
      { id: 'a11', path: "/images/categories/accessory/bracelate.png", price: 850, gram: "50g", desc: "Hand-crafted beaded wrist bracelet.", item: "Bracelets" },
      { id: 'a12', path: "/images/categories/accessory/bracelate1.png", price: 900, gram: "60g", desc: "Metallic charm chain bracelet.", item: "Bracelets" },
      { id: 'a13', path: "/images/categories/accessory/bracelate2.png", price: 950, gram: "55g", desc: "Adjustable wrist band accessory.", item: "Bracelets" },
      { id: 'a14', path: "/images/categories/accessory/bracelate3.png", price: 1000, gram: "65g", desc: "Minimalist silver-plated wrist bracelet.", item: "Bracelets" },
      { id: 'a15', path: "/images/categories/accessory/bracelate5.png", price: 1100, gram: "70g", desc: "Designer luxury leather wristband.", item: "Bracelets" },
      { id: 'a16', path: "/images/categories/accessory/necklace.png", price: 1800, gram: "30g", desc: "Pendant chain necklace.", item: "Necklaces" },
      { id: 'a17', path: "/images/categories/accessory/necklace1.png", price: 1900, gram: "35g", desc: "Golden charm layered chain necklace.", item: "Necklaces" },
      { id: 'a18', path: "/images/categories/accessory/necklace2.png", price: 2000, gram: "38g", desc: "Stone-embedded chain necklace.", item: "Necklaces" },
      { id: 'a19', path: "/images/categories/accessory/necklace3.png", price: 2100, gram: "32g", desc: "Minimalist neckwear accessory.", item: "Necklaces" },
      { id: 'a20', path: "/images/categories/accessory/necklace4.png", price: 2200, gram: "40g", desc: "Handcrafted silver pendant necklace.", item: "Necklaces" }
    ]
  };

  // Filter products based on active category, active sub-item, and price range
  const activeRangeObj = priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
  const categorySearchTerms = {
    men: "men men's mens male clothing clothes",
    women: "women women's womens female clothing clothes",
    kids: "kid kids kid's kids' children clothing clothes",
    accessories: 'accessory accessories',
  };
  const currentCategoryList = searchTerm
    ? Object.entries(categoryData).flatMap(([category, products]) =>
        products.map((product) => ({ ...product, category }))
      )
    : categoryData[activeCategory.toLowerCase()] || categoryData.women;

  const filteredProducts = currentCategoryList.filter((prod) => {
    const category = prod.category || activeCategory;
    const searchableText = `${prod.desc} ${prod.item} ${category} ${categorySearchTerms[category] || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
    const matchesItem = searchTerm || prod.item.toLowerCase() === activeItem.toLowerCase();
    const matchesPrice = prod.price >= activeRangeObj.min && prod.price <= activeRangeObj.max;
    return matchesSearch && matchesItem && matchesPrice;
  });

  const handleSubItemClick = (categoryKey, itemLabel) => {
    setSearchParams({ category: categoryKey, item: itemLabel });
  };

  // Add to Cart handler
  const handleAddToCartClick = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onAddToCart) {
      onAddToCart(product);
    }
    setToastMessage(`Added "${product.desc}" to cart!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Open Product Detail Modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="container-fluid py-3 px-md-4 bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="alert alert-dark alert-dismissible fade show shadow" role="alert">
            <i className="fa-solid fa-circle-check me-2 text-warning"></i>
            {toastMessage}
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setToastMessage('')}
            ></button>
          </div>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION */}
      <div className="d-flex align-items-center mb-4 ps-1">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 align-items-center fs-6">
            <li className="breadcrumb-item d-flex align-items-center">
              <i className="fa-solid fa-house me-2 text-gold"></i>
              <Link to="/" className="text-decoration-none text-gold">Home</Link>
            </li>
            <li className="breadcrumb-item text-dark">Products</li>
            {searchTerm ? (
              <li className="breadcrumb-item active text-dark" aria-current="page">
                Search: {searchParams.get('search')}
              </li>
            ) : (
              <>
                <li className="breadcrumb-item text-capitalize text-dark">
                  {activeCategory}
                </li>
                <li className="breadcrumb-item active text-dark" aria-current="page">
                  {activeItem}
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="row g-4">
        
        {/* LEFT SIDEBAR FILTERS */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="pe-md-2">
            
            <h5 className="text-dark mb-3 fs-5">Filters</h5>

            {/* Shop Categories Collapsible Section */}
            <div className="border-bottom pb-3 mb-3">
              <button
                type="button"
                className="btn w-100 p-0 text-start d-flex justify-content-between align-items-center border-0 text-dark fs-6 mb-2"
                onClick={() => setIsCategoriesSectionOpen(!isCategoriesSectionOpen)}
              >
                <span>Shop Categories</span>
                <i className={`fa-solid fa-chevron-${isCategoriesSectionOpen ? 'up' : 'down'} text-dark`}></i>
              </button>

              {isCategoriesSectionOpen && (
                <div className="d-flex flex-column gap-1">
                  {sidebarCategories.map((cat) => {
                    const isOpen = openCategories[cat.key];
                    const isCatActive = activeCategory.toLowerCase() === cat.key;

                    return (
                      <div key={cat.key} className="rounded-3 overflow-hidden mb-1">
                        {/* Parent Category Button */}
                        <button
                          type="button"
                          className={`btn w-100 text-start py-2 px-3 d-flex justify-content-between align-items-center border-0 transition-all ${
                            isCatActive
                              ? 'gold-bg text-white'
                              : 'text-dark bg-light hover-light'
                          }`}
                          onClick={() => toggleCategory(cat.key)}
                          style={{ fontSize: '0.95rem', borderRadius: '6px' }}
                        >
                          <span>{cat.title}</span>
                          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ${isCatActive ? 'text-white' : 'text-dark'} small`}></i>
                        </button>

                        {/* Collapsible Sub-Items */}
                        {isOpen && (
                          <div className="d-flex flex-column gap-1 pt-1 ps-2">
                            {cat.items.map((subItem, idx) => {
                              const isSubActive =
                                isCatActive && activeItem.toLowerCase() === subItem.toLowerCase();
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`btn w-100 text-start py-1.5 px-3 border-0 transition-all ${
                                    isSubActive
                                      ? 'gold-bg text-white shadow-sm'
                                      : 'text-dark bg-transparent hover-sub'
                                  }`}
                                  style={{ fontSize: '0.9rem', borderRadius: '6px' }}
                                  onClick={() => handleSubItemClick(cat.key, subItem)}
                                >
                                  {subItem}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Range Collapsible Section */}
            <div className="mb-3">
              <button
                type="button"
                className="btn w-100 p-0 text-start d-flex justify-content-between align-items-center border-0 text-dark fs-6 mb-2"
                onClick={() => setIsPriceSectionOpen(!isPriceSectionOpen)}
              >
                <span>Price Range</span>
                <i className={`fa-solid fa-chevron-${isPriceSectionOpen ? 'up' : 'down'} text-dark`}></i>
              </button>

              {isPriceSectionOpen && (
                <div className="d-flex flex-column gap-1">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="d-flex align-items-center gap-2 cursor-pointer py-1 px-2 rounded hover-light"
                      style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="form-check-input mt-0 custom-radio"
                      />
                      <span className="text-dark">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT DISPLAY AREA FOR PRODUCTS */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="row g-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="card h-100 border rounded-3 overflow-hidden shadow-sm product-card">
                    
                    {/* Clickable Product Image */}
                    <div 
                      className="position-relative bg-white p-3 d-flex align-items-center justify-content-center border-bottom cursor-pointer"
                      style={{ height: '220px', cursor: 'pointer' }}
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.path}
                        alt={product.desc}
                        className="img-fluid h-100 object-fit-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/220x220?text=Product+Image';
                        }}
                      />
                      <button
                        type="button"
                        className="product-cart-button"
                        aria-label={`Add ${product.desc} to cart`}
                        title="Add to cart"
                        onClick={(e) => handleAddToCartClick(e, product)}
                      >
                        <img src="/images/cart.png" alt="" aria-hidden="true" />
                      </button>
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="card-body d-flex flex-column p-3">
                      <p className="fw-bold fs-5 text-dark mb-1">
                        {Number(product.price || 0).toLocaleString()} ETB
                      </p>
                      <h6
                        className="text-dark mb-0 product-title-hover"
                        style={{ fontSize: '0.95rem', lineHeight: '1.3', color: '#1a1a1a', cursor: 'pointer' }}
                        onClick={() => handleProductClick(product)}
                      >
                        {product.desc}
                      </h6>
                      {product.gram && (
                        <span className="badge bg-light text-dark border mt-2 align-self-start small">
                          {product.gram}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="fa-solid fa-box-open fs-2 text-dark mb-2"></i>
                <h6 className="text-dark">No products found</h6>
                <p className="text-dark small">
                  {searchTerm
                    ? `No products match "${searchParams.get('search')}". Try another product name or category.`
                    : `No items match the selected price range under "${activeItem}". Try adjusting your filters.`}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fs-5 text-capitalize text-dark">
                  Product Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProduct(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4 align-items-center">
                  <div className="col-12 col-md-6 text-center border-end">
                    <img
                      src={selectedProduct.path}
                      alt={selectedProduct.desc}
                      className="img-fluid rounded object-fit-contain"
                      style={{ maxHeight: '280px' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/280x280?text=Product+Image';
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="badge gold-bg text-white text-capitalize mb-2 px-2 py-1">
                      {activeCategory} / {selectedProduct.item}
                    </span>
                    <h5 className="text-dark mb-3">{selectedProduct.desc}</h5>
                    <div className="fs-4 text-dark mb-3">
                      {selectedProduct.price.toLocaleString()} Birr
                      {selectedProduct.gram && (
                        <span className="fs-6 ms-2 text-muted">({selectedProduct.gram})</span>
                      )}
                    </div>
                    <p className="text-secondary small mb-4">
                      High quality {selectedProduct.item.toLowerCase()} suited for daily wear and modern style. Fast delivery and localized sizing available.
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn gold-bg text-white py-2 px-4 rounded-2 border-0 shadow-sm d-flex align-items-center gap-2"
                        onClick={(e) => {
                          handleAddToCartClick(e, selectedProduct);
                          setSelectedProduct(null);
                        }}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary py-2 px-3 rounded-2"
                        onClick={() => setSelectedProduct(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-Contrast Styling */}
      <style>{`
        .gold-bg {
          background-color: #e69d27 !important;
        }
        .text-gold {
          color: #e69d27 !important;
        }
        .hover-light:hover {
          background-color: #f8f9fa;
        }
        .hover-sub:hover {
          background-color: #f1f3f5;
          color: #000000 !important;
        }
        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-color: #e0e0e0 !important;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
        }
        .product-title-hover:hover {
          color: #e69d27 !important;
        }
        .custom-radio:checked {
          background-color: #e69d27;
          border-color: #e69d27;
        }
      `}</style>
    </div>
  );
};

export default Products;