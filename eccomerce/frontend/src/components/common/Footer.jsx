import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTelegram,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';

const footerStyles = `
  .footer-yellow {
    background-color: #FFC107;
    color: #1A1D20;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .footer-heading {
    color: #1A1D20;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
    position: relative;
    padding-bottom: 0.5rem;
  }
  .footer-heading::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 35px;
    height: 3px;
    background-color: #1A1D20;
    border-radius: 2px;
  }
  .footer-link {
    color: #2D3136;
    text-decoration: none;
    transition: all 0.25s ease;
    display: block;
    margin-bottom: 0.65rem;
    font-size: 0.95rem;
    font-weight: 500;
  }
  .footer-link:hover {
    color: #000000;
    padding-left: 6px;
    font-weight: 700;
  }
  .brand-logo-container {
    width: 50px;
    height: 50px;
    background-color: #FFFFFF;
    border: 2px solid #1A1D20;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    flex-shrink: 0;
  }
  .social-btn {
    width: 40px;
    height: 40px;
    background-color: #1A1D20;
    color: #FFC107;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    text-decoration: none;
    font-size: 1.1rem;
    flex: 0 0 40px;
  }
  .social-btn:hover {
    background-color: #000000;
    color: #FFFFFF;
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .footer-divider {
    border-color: rgba(0, 0, 0, 0.15) !important;
  }
`;

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer-yellow pt-5 pb-4 border-top border-warning">
        <div className="container-fluid px-3 px-lg-5">
          <div className="row g-4 pb-4">
            
            {/* Column 1: Ethio Shop Brand & Social Icons */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="brand-logo-container">
                  <img 
                    src="/images/logo.png" 
                    alt="Ethio Shop Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <span className="fs-3 fw-bold text-dark">Ethio Shop</span>
              </div>
              <p className="small mb-3 text-dark fw-medium" style={{ lineHeight: '1.6' }}>
                Your premier Ethiopian online shopping portal. Delivering top quality men's, women's, and kids' fashion, footwear, and accessories right to your door.
              </p>
              
              {/* Contact Information */}
              <div className="small text-dark fw-semibold mb-3">
                <p className="mb-1">
                  <i className="fa-solid fa-location-dot me-2 text-dark"></i>Addis Ababa & Adama, Ethiopia
                </p>
                <p className="mb-0">
                  <i className="fa-solid fa-phone me-2 text-dark"></i>+251 900 000 000
                </p>
              </div>

              {/* Social Icons */}
              <div className="d-flex gap-2 pt-1">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="social-btn" aria-label="Telegram">
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="TikTok">
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className="col-6 col-md-4 col-lg-2 offset-lg-1">
              <h6 className="footer-heading">Categories</h6>
              <Link to="/category/men" className="footer-link">Men's Fashion</Link>
              <Link to="/category/women" className="footer-link">Women's Fashion</Link>
              <Link to="/category/kids" className="footer-link">Kids Collection</Link>
              <Link to="/category/accessories" className="footer-link">Accessories</Link>
              <Link to="/category/footwear" className="footer-link">Footwear</Link>
              <Link to="/deals" className="footer-link">Special Deals</Link>
            </div>

            {/* Column 3: Customer Service */}
            <div className="col-6 col-md-4 col-lg-2">
              <h6 className="footer-heading">Customer Service</h6>
              <Link to="/help" className="footer-link">Help Center / FAQ</Link>
              <Link to="/orders" className="footer-link">Track Your Order</Link>
              <Link to="/shipping" className="footer-link">Shipping & Delivery</Link>
              <Link to="/returns" className="footer-link">Returns & Refunds</Link>
              <Link to="/contact" className="footer-link">Contact Support</Link>
            </div>

            {/* Column 4: About Ethio Shop */}
            <div className="col-12 col-md-4 col-lg-3">
              <h6 className="footer-heading">About Us</h6>
              <Link to="/about" className="footer-link">About Ethio Shop</Link>
              <Link to="/careers" className="footer-link">Careers</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              <Link to="/sell" className="footer-link">Become a Vendor</Link>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="row pt-3 border-top footer-divider align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="small mb-0 text-dark fw-bold">
                &copy; {new Date().getFullYear()} Ethio Shop. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <span className="small me-3 text-dark fw-medium">Secure Payment Options</span>
              <span className="badge text-bg-dark">Chapa</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}