import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const navCustomStyles = `
  .custom-navbar {
    background-color: #FFC107 !important;
    min-height: 65px;
  }
  .search-input-group {
    border: 1px solid #333333;
    border-radius: 4px !important;
    overflow: hidden;
  }
  .search-input-group .form-control {
    border: none !important;
    font-size: 0.875rem;
  }
  .search-input-group .form-control:focus {
    box-shadow: none !important;
  }
  .btn-search-custom {
    background-color: #FFC107 !important;
    color: #212529 !important;
    border: none !important;
    border-left: 1px solid #333333 !important;
    border-radius: 0 !important;
    font-size: 0.875rem;
    transition: all 0.2s ease-in-out;
  }
  .btn-search-custom:hover {
    background-color: #e0a800 !important;
    color: #000000 !important;
  }
  .nav-btn-seamless {
    background-color: transparent !important;
    color: #212529 !important;
    border: none !important;
    padding: 6px 10px;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    box-shadow: none !important;
    white-space: nowrap;
  }
  .nav-btn-seamless:hover {
    background-color: rgba(0, 0, 0, 0.08) !important;
    border-radius: 4px;
  }
  .dropdown-toggle-no-caret::after {
    display: inline-block;
    margin-left: 0.3em;
    vertical-align: 0.255em;
  }
`;

export default function Navbar({ cartItemsCount = 0, cartTotalPrice = 0, user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ 
    code: 'ET', 
    flagImg: '/images/ethiopia.png', 
    name: 'Ethiopia' 
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <style>{navCustomStyles}</style>
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-1 custom-navbar">
        <div className="container-fluid px-3 px-lg-4">
          
          {/* Brand Logo Container */}
          <Link className="navbar-brand me-3 d-flex align-items-center gap-2 text-dark py-1" to="/">
            <div 
              className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm overflow-hidden" 
              style={{ width: '38px', height: '38px', padding: '3px' }}
            >
              <img 
                src="/images/logo.png"       
                alt="Ethio Shop Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <span className="fw-bold fs-5 text-dark d-none d-sm-inline">Ethio Shop</span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler border-0 shadow-none text-dark ms-auto me-2" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Collapse Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="d-flex mx-lg-auto me-lg-3 my-2 my-lg-0 w-100" style={{ maxWidth: '480px' }}>
              <div className="input-group search-input-group bg-white align-items-center">
                <span className="bg-white border-0 ps-3 pe-1 text-secondary">
                  <Search size={18} aria-hidden="true" />
                </span>
                <input 
                  type="search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control py-2 fs-6 text-dark" 
                  placeholder="Search products, brands, categories..." 
                  aria-label="Search"
                />
                <button className="btn btn-search-custom px-3 fw-bold" type="submit">
                  Search
                </button>
              </div>
            </form>

            {/* Right Horizontal Navigation Items */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center flex-row gap-2">
              
              {/* Country Selector Dropdown */}
              <li className="nav-item dropdown">
                <button 
                  className="btn nav-btn-seamless dropdown-toggle dropdown-toggle-no-caret d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                    <img 
                      src={selectedCountry.flagImg} 
                      alt={selectedCountry.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerText = '🇪🇹';
                      }}
                    />
                  </div>
                  <span>{selectedCountry.code}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: '130px' }}>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center gap-2 active" 
                      type="button" 
                      onClick={() => setSelectedCountry({ code: 'ET', flagImg: '/images/ethiopia.png', name: 'Ethiopia' })}
                    >
                      <img src="/images/ethiopia.png" alt="Ethiopia" style={{ width: '18px', height: '18px', borderRadius: '50%' }} /> Ethiopia
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center gap-2" 
                      type="button" 
                      onClick={() => setSelectedCountry({ code: 'US', flagImg: '/images/usa.png', name: 'USA' })}
                    >
                      <span>🇺🇸</span> USA
                    </button>
                  </li>
                </ul>
              </li>

              {/* Login or profile link */}
              <li className="nav-item">
                <Link
                  className="nav-link nav-btn-seamless d-flex align-items-center gap-2 text-dark"
                  to={user ? '/profile' : '/login'}
                >
                  <img src="/images/login.png" alt="Login" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  <span>{user ? 'My Account' : 'Login'}</span>
                </Link>
              </li>

              {/* Cart Button with + Count Badge */}
              <li className="nav-item">
                <Link className="nav-link nav-btn-seamless d-flex align-items-center gap-2 text-dark" to="/cart" title="View Shopping Cart">
                  <div className="position-relative d-inline-flex align-items-center justify-content-center">
                    <img 
                      src="/images/cart.png" 
                      alt="Cart" 
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                    />
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-white d-flex align-items-center justify-content-center"
                      style={{ fontSize: '0.65rem', minWidth: '18px', height: '18px', padding: '2px' }}
                    >
                      {cartItemsCount > 0 ? `+${cartItemsCount}` : '+'}
                    </span>
                  </div>

                  <span className="fw-bold fs-6">
                    {Number(cartTotalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} Birr
                  </span>
                </Link>
              </li>

            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}