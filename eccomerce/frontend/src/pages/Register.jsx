import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const sharedAuthStyles = `
  .login-page-container {
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  .auth-card-professional {
    max-width: 420px;
    width: 100%;
    border-radius: 10px;
    border: none !important;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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

export default function Register({ setUser, onLoginSuccess }) {
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

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      await fetch('http://localhost:5000/api/health');
    } catch (error) {
      console.warn('Backend server unreachable on mount. Offline mode enabled.');
    }
  };

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
    if (!cleanEmail.endsWith('@gmail.com')) {
      setErrorMessage('Please enter a valid @gmail.com email address.');
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          email: cleanEmail,
          password: password.trim(),
          name: cleanEmail.split('@')[0]
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('✓ Registration successful! Redirecting to login...');
        sessionStorage.setItem('registeredEmail', cleanEmail);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please check your information.');
      }
    } catch (error) {
      console.warn('Backend server offline. Registering in local mode...');
      
      // Fallback Local Registration Session
      const registeredUser = {
        email: cleanEmail,
        phoneNumber: fullPhoneNumber,
        fullName: cleanEmail.split('@')[0]
      };

      localStorage.setItem('app_user', JSON.stringify(registeredUser));
      localStorage.setItem('user', JSON.stringify(registeredUser));

      if (typeof setUser === 'function') setUser(registeredUser);
      if (typeof onLoginSuccess === 'function') onLoginSuccess(registeredUser);

      setSuccessMessage('✓ Registration successful (Local Mode). Redirecting...');
      setTimeout(() => navigate('/login'), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{sharedAuthStyles}</style>
      <div className="login-page-container d-flex align-items-center justify-content-center p-3">
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
                    placeholder="username@gmail.com"
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
    </>
  );
}