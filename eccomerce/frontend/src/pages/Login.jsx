import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const sharedAuthStyles = `
  .login-page-container {
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  .auth-card-professional {
    max-width: 420px;
    width: 100%;
    border-radius: 12px;
    border: none !important;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

  .btn-google-account {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;
    font-weight: 600;
    padding: 0.65rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    position: relative;
  }

  .btn-google-account:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #0d6efd;
  }

  .btn-google-account:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .google-active-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background-color: #e8f5e9;
    border-radius: 20px;
    font-size: 12px;
    color: #2e7d32;
    font-weight: 600;
    margin-bottom: 12px;
    width: fit-content;
  }

  .active-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #4caf50;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f8f9fa;
  }

  .loading-content {
    text-align: center;
  }

  .loading-content h4 {
    margin-top: 1rem;
    color: #495057;
    font-size: 18px;
  }

  .loading-content p {
    color: #6c757d;
    font-size: 14px;
    margin-top: 0.5rem;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasActiveGoogleAccount, setHasActiveGoogleAccount] = useState(false);

  // Check for existing session and handle OAuth callback on component mount
  useEffect(() => {
    checkExistingSession();
    handleOAuthCallback();
  }, []);

  // Check if user already has an active session
  const checkExistingSession = () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const loginMethod = localStorage.getItem('loginMethod');

      if (token && user) {
        const userData = JSON.parse(user);
        
        // Check if token is still valid
        if (isTokenValid()) {
          console.log('✓ Active session found. Redirecting to dashboard...');
          navigate('/dashboard');
          return;
        } else {
          // Token expired, clear it
          clearAuthData();
        }
      }

      // Check if there's an active Google account
      if (loginMethod === 'google') {
        setHasActiveGoogleAccount(true);
      }

      setCheckingSession(false);
    } catch (error) {
      console.error('Session check error:', error);
      setCheckingSession(false);
    }
  };

  // Handle OAuth callback from Google
  const handleOAuthCallback = () => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        saveAuthSession(userData, token, 'google');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        setErrorMessage('Authentication failed. Please try again.');
      }
    }
  };

  // Validate token expiration
  const isTokenValid = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true; // No expiry set, assume valid
    
    return Date.now() < parseInt(expiry);
  };

  // Save authentication data to localStorage
  const saveAuthSession = (userData, token, method = 'email') => {
    const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    localStorage.setItem('loginMethod', method);
    localStorage.setItem('userEmail', userData.email);

    // Also save to app_user for compatibility
    localStorage.setItem('app_user', JSON.stringify(userData));
  };

  // Clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('app_user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('userEmail');
  };

  // Handle email/password login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail.endsWith('@gmail.com')) {
      setErrorMessage('Security constraint: Please enter a valid @gmail.com address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: cleanEmail, 
          password: password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        saveAuthSession(data.user, data.token, 'email');
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login API Error:', error);
      setErrorMessage('Server connection failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleAuth = async () => {
    setLoading(true);
    
    try {
      // If user has active Google account, use it directly
      if (hasActiveGoogleAccount) {
        const userData = JSON.parse(localStorage.getItem('user'));
        saveAuthSession(userData, localStorage.getItem('token'), 'google');
        navigate('/dashboard');
        return;
      }

      // Otherwise, redirect to server's Google OAuth endpoint
      window.location.href = 'http://localhost:5000/api/auth/google';
    } catch (error) {
      console.error('Google Auth Error:', error);
      setErrorMessage('Failed to authenticate with Google. Please try again.');
      setLoading(false);
    }
  };

  // Show loading screen while checking session
  if (checkingSession) {
    return (
      <>
        <style>{sharedAuthStyles}</style>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Checking your session...</h4>
            <p>Please wait while we verify your account</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{sharedAuthStyles}</style>
      <div className="login-page-container d-flex align-items-center justify-content-center p-3">
        <div className="auth-card-professional rounded-3 overflow-hidden p-4">
          
          {/* Top Heading */}
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark m-0">Welcome to Login</h3>
            <p className="text-muted fs-7 mt-1">Please enter your details to access your account</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger py-2 fs-7 text-center mb-3" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Active Google Account Badge */}
          {hasActiveGoogleAccount && (
            <div className="google-active-badge">
              <span className="active-indicator"></span>
              Active Google Account
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleLoginSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fs-7 fw-semibold text-secondary">Email</label>
              <div className="input-group auth-input-group">
                <input 
                  type="email" 
                  className="form-control py-2 fs-6 px-3" 
                  placeholder="username@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                  title="Only @gmail.com domain addresses are permitted"
                  autoComplete="email"
                  disabled={loading}
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label fs-7 fw-semibold text-secondary">Password</label>
              <div className="input-group auth-input-group align-items-center">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control py-2 fs-6 px-3" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  autoComplete="current-password"
                  disabled={loading}
                  required 
                />
                <button 
                  type="button" 
                  className="btn border-0 text-muted px-3 h-100"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-yellow-continue w-100 my-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1 my-0 text-muted" />
            <span className="px-3 text-muted fs-7 fw-bold">OR</span>
            <hr className="flex-grow-1 my-0 text-muted" />
          </div>

          {/* Google Auth Button */}
          <button 
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="btn btn-google-account w-100 d-flex align-items-center justify-content-center gap-2"
            title={hasActiveGoogleAccount ? "Continue with your active Google account" : "Sign in with Google"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>
              {hasActiveGoogleAccount ? 'Continue with Active Account' : 'Continue with Google'}
            </span>
          </button>

          {/* Terms Footer */}
          <p className="text-center text-muted fs-7 mt-3 mb-0">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-dark text-decoration-underline fw-semibold">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-dark text-decoration-underline fw-semibold">
              Privacy Policy
            </Link>.
          </p>

          {/* Sign Up Section */}
          <div className="text-center pt-3 mt-3 border-top">
            <span className="text-secondary fs-7">Don't have an account? </span>
            <Link to="/register" className="text-dark fw-bold text-decoration-none fs-7 ms-1">
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
