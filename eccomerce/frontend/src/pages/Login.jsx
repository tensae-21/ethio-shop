import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { hasValidSession, login, logout } from '../services/authService';

const authStyles = `
  .login-page-container { background-color: #ffc107; min-height: 76vh; }
  .auth-layout {
    max-width: 1040px;
    width: 100%;
    display: grid;
    grid-template-columns: 420px minmax(0, 1fr);
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);
    padding: 2rem;
  }
  .auth-welcome { color: #212529; }
  .auth-welcome { grid-column: 2; grid-row: 1; }
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
  .auth-card-professional {
    grid-column: 1;
    grid-row: 1;
    max-width: 420px;
    width: 100%;
    border: none;
    background: #fff;
    box-shadow: 0 15px 45px rgba(70, 48, 0, .16);
  }
  .btn-yellow-continue {
    background-color: #ffc107;
    color: #212529;
    border: 0;
    font-weight: 700;
    padding: .75rem 1rem;
  }
  .btn-yellow-continue:hover:not(:disabled) { background-color: #e0a800; }
  .auth-input-group { border: 1px solid #ced4da; border-radius: 6px; overflow: hidden; }
  .auth-input-group:focus-within { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13, 110, 253, .2); }
  .auth-input-group .form-control { border: 0; box-shadow: none; }
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #ffc107;
  }
  @media (max-width: 767.98px) {
    .auth-layout { grid-template-columns: 1fr; gap: 1.5rem; padding: 1rem; max-width: 500px; }
    .auth-card-professional { grid-column: 1; grid-row: 1; }
    .auth-welcome { grid-column: 1; grid-row: 2; }
    .auth-welcome { text-align: center; }
    .auth-welcome-icon { width: 112px; height: 112px; font-size: 3.3rem; }
    .auth-welcome p { margin-inline: auto; margin-bottom: 0; }
  }
`;

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => sessionStorage.getItem('registeredEmail') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession] = useState(() => hasValidSession());
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasValidSession()) {
      navigate('/profile', { replace: true });
      return;
    }

    if (localStorage.getItem('token')) logout();
  }, [navigate]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login({ email: email.trim().toLowerCase(), password });
      sessionStorage.removeItem('registeredEmail');
      onLoginSuccess?.(result.user);
      navigate('/profile', { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Could not connect to the server. Please check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="loading-container" role="status">
        <span className="spinner-border text-primary" aria-hidden="true" />
        <span className="visually-hidden">Checking your session...</span>
      </div>
    );
  }

  return (
    <>
      <style>{authStyles}</style>
      <div className="login-page-container d-flex align-items-center justify-content-center">
        <div className="auth-layout">
          <section className="auth-welcome">
            <h1>Welcome to Login</h1>
            <span className="auth-welcome-icon my-4" aria-hidden="true">
              <Truck size={76} strokeWidth={1.8} />
            </span>
            <p className="mb-0">Sign in to your Ethio Shop account and keep your shopping journey moving.</p>
          </section>

          <div className="auth-card-professional rounded-3 overflow-hidden p-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-dark m-0">Welcome back</h3>
              <p className="text-muted mt-2 mb-0">Log in to your Ethio Shop account</p>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" htmlFor="login-email">
                Email
              </label>
              <div className="input-group auth-input-group">
                <input
                  id="login-email"
                  type="email"
                  className="form-control py-2 px-3"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" htmlFor="login-password">
                Password
              </label>
              <div className="input-group auth-input-group align-items-center">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control py-2 px-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="btn border-0 text-muted px-3"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-yellow-continue w-100 my-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
            </form>

            <div className="text-center pt-3 mt-3 border-top">
              <span className="text-secondary">Don't have an account? </span>
              <Link to="/register" className="text-dark fw-bold text-decoration-none ms-1">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
