import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Headset, ShieldCheck, Tags } from 'lucide-react';

const customHeroStyles = `
  /* Left Category Hover Interactions */
  .category-item {
    position: relative;
  }

  .category-item-row {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  
  .category-item:hover .category-item-row {
    background-color: #FFF5F2 !important;
  }

  /* Invisible hover bridge */
  .category-item::after {
    content: "";
    position: absolute;
    top: 0;
    right: -20px;
    width: 20px;
    height: 100%;
    z-index: 1040;
  }

  /* Display dropdown flyout menu on hover */
  .category-item:hover .category-submenu,
  .category-submenu:hover {
    display: block !important;
  }

  .category-item:hover .category-title-text {
    color: #FF6B35 !important;
    font-weight: 600 !important;
  }

  .category-item:hover .category-arrow {
    color: #FF6B35 !important;
    transform: translateX(4px);
  }

  .category-arrow {
    transition: transform 0.2s ease, color 0.2s ease;
  }

  /* Submenu Positioning & High Z-Index */
  .category-submenu {
    position: absolute !important;
    left: 100% !important;
    top: 0 !important;
    z-index: 1050 !important;
    min-width: 260px;
    margin-left: 2px !important;
    pointer-events: auto !important;
  }

  .dropdown-item-custom {
    color: #495057;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    font-size: 0.88rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1051;
  }

  .dropdown-item-custom:hover {
    background-color: #FFF0EB !important;
    color: #FF6B35 !important;
    padding-left: 1.25rem !important;
  }

  .category-scroll-container {
    max-height: 280px;
    overflow-y: auto;
  }

  .category-img-badge {
    border: 1.5px solid #FFDCD1 !important;
    transition: border-color 0.2s ease;
  }

  .category-item:hover .category-img-badge {
    border-color: #FF6B35 !important;
  }

  /* Carousel Custom Dots Navigation */
  .carousel-custom-dots button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    margin: 0 5px !important;
    background-color: #ffffff !important;
    opacity: 0.6;
    border: none;
  }

  .carousel-custom-dots button.active {
    opacity: 1;
    background-color: #FF6B35 !important;
    transform: scale(1.2);
  }

  /* Right Side Peach Container & Feature Items */
  .peach-card-box {
    background-color: #FFE8E0 !important;
    border: 1px solid #FFD0C2 !important;
  }

  .feature-item-card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 10px 12px;
    border: 1px solid #f2cfc6;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .feature-item-card:hover {
    transform: translateY(-2px);
    border-color: #FF6B35;
  }

  .feature-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const Hero = ({ onSelectCategory }) => {
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const element = document.getElementById('heroCarousel');
    if (element && window.bootstrap && window.bootstrap.Carousel) {
      const carouselInstance = new window.bootstrap.Carousel(element, {
        interval: 2000,
        ride: 'carousel',
        pause: 'hover',
        touch: true
      });
      carouselInstance.cycle();
    }
  }, []);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const categoryData = [
    {
      name: "Men's Clothes",
      id: "men",
      img: "/images/categories/men/shirt.png",
      headerImg: "/images/categories/men/shirt.png",
      fallbackIcon: "fa-mars",
      items: [
        { name: "T-Shirts", img: "/images/categories/men/t shirt.png" },
        { name: "Shirts", img: "/images/categories/men/shirt2.png" },
        { name: "Jeans", img: "/images/categories/men/jeans.png" },
        { name: "Jackets", img: "/images/categories/men/jacket.png" },
        { name: "Hoodies", img: "/images/categories/men/hoodies.png" },
        { name: "Formal Shoes", img: "/images/categories/men/brand shoes.png" }
      ]
    },
    {
      name: "Women's Clothes",
      id: "women",
      img: "/images/categories/women/fashion women.png",
      headerImg: "/images/categories/women/fashion women.png",
      fallbackIcon: "fa-venus",
      items: [
        { name: "Dresses", img: "/images/categories/women/dress.png" },
        { name: "Traditional clothes", img: "/images/categories/women/TD deraro.png" },
        { name: "Jeans", img: "/images/categories/women/jeans.png" },
        { name: "Jackets", img: "/images/categories/women/jacket.png" },
        { name: "Hoodies", img: "/images/categories/women/W hoodies.png" },
        { name: "Women Shoes", img: "/images/categories/women/W shoes.png" }
      ]
    },
    {
      name: "Kids' Clothes",
      id: "kids",
      img: "/images/categories/kids/dress.png",
      headerImg: "/images/categories/kids/dress.png",
      fallbackIcon: "fa-child",
      items: [
        { name: "T-Shirts", img: "/images/categories/kids/kid t shirt.png" },
        { name: "Dresses", img: "/images/categories/kids/kid dress.png" },
        { name: "Shoes", img: "/images/categories/kids/kid shoes.png" }
      ]
    },
    {
      name: "Accessories",
      id: "accessories",
      img: "/images/categories/accessory/watches.png",
      headerImg: "/images/categories/accessory/watches.png",
      fallbackIcon: "fa-gem",
      items: [
        { name: "Watches", img: "/images/categories/accessory/watches.png" },
        { name: "Sunglasses", img: "/images/categories/accessory/glass.png" },
        { name: "Jewelry", img: "/images/categories/accessory/jewelary.png" },
        { name: "Necklaces", img: "/images/categories/accessory/necklace.png" },
        { name: "Bracelets", img: "/images/categories/accessory/bracelate.png" }
      ]
    }
  ];

  return (
    <>
      <style>{customHeroStyles}</style>

      <div className="container-fluid px-3 py-3">
        <div className="row g-3 align-items-stretch">
          
          {/* 1. Left Categories Menu */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="card border shadow-sm rounded-3 bg-white" style={{ height: '380px', zIndex: 1030 }}>
              <div className="card-header bg-white py-3 border-bottom text-dark d-flex align-items-center gap-2">
                <i className="fa-solid fa-bars text-danger ps-2 fs-6"></i>
                <h5 className="m-0 fs-6 fw-bold">All Categories</h5>
              </div>

              <div className="list-group list-group-flush position-relative">
                {categoryData.map((cat, idx) => {
                  const catImgKey = `cat-img-${cat.id}`;
                  const headerImgKey = `header-img-${cat.id}`;

                  return (
                    <div key={idx} className="category-item">
                      
                      {/* Hover Parent Row */}
                      <div 
                        className="category-item-row list-group-item border-0 d-flex justify-content-between align-items-center py-3 ps-3 pe-3"
                        onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="category-img-badge rounded-circle overflow-hidden bg-light border d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '36px', height: '36px', flexShrink: 0 }}
                          >
                            {imageErrors[catImgKey] ? (
                              <i className={`fa-solid ${cat.fallbackIcon} text-secondary`}></i>
                            ) : (
                              <img 
                                src={cat.img} 
                                alt={cat.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => handleImageError(catImgKey)}
                              />
                            )}
                          </div>
                          <span className="fw-semibold text-dark category-title-text small">
                            {cat.name}
                          </span>
                        </div>
                        <span className="category-arrow text-muted fs-6">›</span>
                      </div>

                      {/* Flyout Submenu Panel */}
                      <div className="category-submenu dropdown-menu shadow-lg border d-none m-0 rounded-2 p-0 bg-white overflow-hidden">
                        <div className="position-relative bg-light border-bottom p-2 d-flex align-items-center gap-2">
                          {imageErrors[headerImgKey] ? (
                            <div className="rounded border bg-white d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                              <i className={`fa-solid ${cat.fallbackIcon} text-secondary`}></i>
                            </div>
                          ) : (
                            <img 
                              src={cat.headerImg} 
                              alt={cat.name} 
                              className="rounded border" 
                              style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                              onError={() => handleImageError(headerImgKey)}
                            />
                          )}
                          <div>
                            <h6 className="m-0 fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{cat.name}</h6>
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>Featured Collection</span>
                          </div>
                        </div>

                        {/* Clickable Items */}
                        <div className="category-scroll-container py-2">
                          {cat.items.map((sub, sIdx) => {
                            const subImgKey = `sub-img-${cat.id}-${sIdx}`;
                            return (
                              <Link 
                                key={sIdx} 
                                className="dropdown-item dropdown-item-custom py-2 px-3 fw-medium text-decoration-none" 
                                to={`/products?category=${cat.id}&item=${encodeURIComponent(sub.name.toLowerCase())}`}
                                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                              >
                                {imageErrors[subImgKey] ? (
                                  <div className="rounded border me-2 bg-light d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                                    <i className="fa-solid fa-tag text-secondary small"></i>
                                  </div>
                                ) : (
                                  <img 
                                    src={sub.img} 
                                    alt={sub.name} 
                                    className="rounded border me-2" 
                                    style={{ width: '28px', height: '28px', objectFit: 'cover', flexShrink: 0 }}
                                    onError={() => handleImageError(subImgKey)}
                                  />
                                )}
                                <span>{sub.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* 2. Middle Carousel */}
          <div className="col-12 col-md-8 col-lg-5">
            <div 
              id="heroCarousel" 
              className="carousel slide carousel-fade overflow-hidden rounded-3 shadow-sm border bg-dark position-relative" 
              data-bs-ride="carousel"
              data-bs-interval="2000"
              style={{ height: '380px', zIndex: 1 }}
            >
              <div className="carousel-indicators carousel-custom-dots mb-3">
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>

              <div className="carousel-inner h-100">
                <div className="carousel-item active h-100">
                  <img src="/images/hero.png" className="d-block w-100 h-100 object-fit-cover" alt="Hero Banner 1" />
                </div>
                <div className="carousel-item h-100">
                  <img src="/images/hero1.png" className="d-block w-100 h-100 object-fit-cover" alt="Hero Banner 2" />
                </div>
                <div className="carousel-item h-100">
                  <img src="/images/hero2.png" className="d-block w-100 h-100 object-fit-cover" alt="Hero Banner 3" />
                </div>
              </div>

              <button className="carousel-control-prev z-3" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next z-3" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* 3. Right Peach Feature Card Box */}
          <div className="col-12 col-lg-4">
            <div className="card peach-card-box shadow-sm rounded-3 p-3 text-start d-flex flex-column justify-content-between" style={{ height: '380px' }}>
              <div>
                <span className="badge bg-danger px-3 py-1 rounded-pill fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
                  Official Store
                </span>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <img
                    src="/images/logo.png"
                    alt="Ethio Shop logo"
                    style={{ width: 42, height: 42, objectFit: 'contain' }}
                  />
                  <h3 className="fw-bold text-dark fs-5 mb-0">
                    Welcome to Ethio Shop
                  </h3>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 my-1">
                <div className="feature-item-card d-flex align-items-center gap-3">
                  <div className="feature-icon-wrapper" style={{ backgroundColor: '#e7f1ff', color: '#0d6efd' }}>
                    <Headset size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.82rem' }}>Customer Service</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                      24/7 dedicated customer support
                    </p>
                  </div>
                </div>

                <div className="feature-item-card d-flex align-items-center gap-3">
                  <div className="feature-icon-wrapper" style={{ backgroundColor: '#fff3cd', color: '#b58100' }}>
                    <Tags size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.82rem' }}>Fair Price</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                      Best affordable daily budget deals
                    </p>
                  </div>
                </div>

                <div className="feature-item-card d-flex align-items-center gap-3">
                  <div className="feature-icon-wrapper" style={{ backgroundColor: '#d1e7dd', color: '#198754' }}>
                    <ShieldCheck size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.82rem' }}>Quality Product</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                      Guaranteed premium tested high quality
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Hero;