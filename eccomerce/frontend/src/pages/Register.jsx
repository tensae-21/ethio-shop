import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { register } from '../services/authService';

const sharedAuthStyles = `
  .login-page-container {
    background-color: #ffc107;
    min-height: 76vh;
  }

  .auth-layout {
    max-width: 1040px;
    width: 100%;
    display: grid;
    grid-template-columns: 440px minmax(0, 1fr);
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);
    padding: 2rem;
  }

  .auth-welcome { color: #212529; grid-column: 2; grid-row: 1; }
  .auth-card-professional { grid-column: 1; grid-row: 1; }
  .auth-welcome-icon {
    width: 154px;
    height: 154px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;
    color: #d99a00;
    font-size: 4.5rem;
    box-shadow: 0 12px 30px rgba(70, 48, 0, .14);
  }
  .auth-welcome h1 { font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 800; }
  .auth-welcome p { max-width: 430px; font-size: 1.1rem; }

  @media (max-width: 767.98px) {
    .auth-layout { grid-template-columns: 1fr; gap: 1.5rem; padding: 1rem; max-width: 520px; }
    .auth-card-professional { grid-column: 1; grid-row: 1; }
    .auth-welcome { grid-column: 1; grid-row: 2; }
    .auth-welcome { text-align: center; }
    .auth-welcome-icon { width: 112px; height: 112px; font-size: 3.3rem; }
    .auth-welcome p { margin-inline: auto; margin-bottom: 0; }
  }

  .auth-card-professional {
    max-width: 420px;
    width: 100%;
    border-radius: 10px;
    border: none !important;
    background: #ffffff;
    box-shadow: 0 15px 45px rgba(70, 48, 0, .16);
  }

  .btn-yellow-continue {
    background-color: #FFC107 !important;
    color: #212529 !important;
    border: none;
    font-weight: 700;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
  }

  .btn-yellow-continue:hover:not(:disabled) {
    background-color: #e0a800 !important;
    color: #000000 !important;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.35);
  }

  .btn-yellow-continue:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-input-group {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #ced4da;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .auth-input-group:focus-within {
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
  }

  .auth-input-group .form-control {
    border: none !important;
    box-shadow: none !important;
  }

  .auth-input-group .form-control:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
  }

  .country-code-text {
    background-color: #f1f3f5;
    border-right: 1px solid #ced4da !important;
    color: #495057;
    font-weight: 600;
  }

  .register-header {
    text-align: center;
    padding: 2rem 1.5rem 1.5rem;
    border-bottom: 1px solid #e9ecef;
  }

  .register-header h3 {
    font-size: 24px;
    font-weight: 700;
    color: #212529;
    margin-bottom: 0.5rem;
  }

  .form-section {
    padding: 2rem 1.5rem;
  }

  .footer-section {
    text-align: center;
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
    background-color: #f8f9fa;
  }
`;

export default function Register() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Phone validation
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!/^[97]\d{8}$/.test(cleanPhone)) {
      setErrorMessage('Enter a valid 9-digit Ethiopian phone number starting with 9 or 7.');
      return;
    }

    // Email validation
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!password || password.trim().length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    const fullPhoneNumber = `+251${cleanPhone}`;

    try {
      await register({
        phoneNumber: fullPhoneNumber,
        email: cleanEmail,
        password,
        fullName: cleanEmail.split('@')[0],
      });
      setSuccessMessage('Registration successful! Please log in.');
      sessionStorage.setItem('registeredEmail', cleanEmail);
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Could not connect to the server. Please try again when the backend is available.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{sharedAuthStyles}</style>
      <div className="login-page-container d-flex align-items-center justify-content-center">
        <div className="auth-layout">
          <section className="auth-welcome">
            <h1>Welcome to Register</h1>
            <span className="auth-welcome-icon my-4" aria-hidden="true">
              <Truck size={76} strokeWidth={1.8} />
            </span>
            <p className="mb-0">Create your Ethio Shop account and get ready to discover something you love.</p>
          </section>

          <div className="auth-card-professional rounded-3 overflow-hidden">
          
          <div className="register-header">
            <h3>Create Your Account</h3>
          </div>

          <div className="form-section">
            {errorMessage && (
              <div className="alert alert-danger py-2 fs-7 text-center mb-3" role="alert">
                <i className="fa-solid fa-circle-exclamation me-2"></i>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success py-2 fs-7 text-center mb-3" role="alert">
                <i className="fa-solid fa-check-circle me-2"></i>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold text-secondary">Phone Number</label>
                <div className="input-group auth-input-group">
                  <span className="input-group-text country-code-text fs-6 px-3">+251</span>
                  <input 
                    type="tel" 
                    className="form-control py-2 fs-6 px-3" 
                    placeholder="912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    maxLength={9}
                    disabled={loading}
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold text-secondary">Email Address</label>
                <div className="input-group auth-input-group">
                  <input 
                    type="email" 
                    className="form-control py-2 fs-6 px-3" 
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fs-7 fw-semibold text-secondary">Password</label>
                <div className="input-group auth-input-group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control py-2 fs-6 px-3" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    disabled={loading}
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn border-0 text-muted px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    disabled={loading}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fs-7 fw-semibold text-secondary">Confirm Password</label>
                <div className="input-group auth-input-group">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    className="form-control py-2 fs-6 px-3" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    disabled={loading}
                    required 
                  />
                  <button 
                    type="button" 
                    className="btn border-0 text-muted px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                    disabled={loading}
                  >
                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <small className="text-danger d-block mt-1">Passwords do not match</small>
                )}
                {confirmPassword && password === confirmPassword && password.length > 0 && (
                  <small className="text-success d-block mt-1">Passwords match</small>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-yellow-continue w-100 my-2" 
                disabled={loading || !password || password !== confirmPassword}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>

          <div className="footer-section">
            <span className="text-secondary fs-7">Already have an account? </span>
            <Link to="/login" className="text-dark fw-bold text-decoration-none fs-7 ms-1">
              Log In
            </Link>
          </div>

          </div>
        </div>
      </div>
    </>
  );
}