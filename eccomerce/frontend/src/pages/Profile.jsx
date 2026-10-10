import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AtSign, EyeOff, History, LogOut, PackageOpen, Phone, Shirt, UserRound } from 'lucide-react';
import Orders from './Orders';
import { hasValidSession } from '../services/authService';

const dashboardStyles = `
  .account-dashboard { max-width: 1180px; }
  .dashboard-sidebar { min-height: 100%; }
  .dashboard-nav-button {
    width: 100%;
    border: 0;
    border-radius: .65rem;
    background: transparent;
    color: #495057;
    display: flex;
    align-items: center;
    gap: .85rem;
    padding: .85rem 1rem;
    text-align: left;
    font-weight: 600;
  }
  .dashboard-nav-button:hover,
  .dashboard-nav-button.active { background: #fff3cd; color: #212529; }
  .dashboard-nav-button i { width: 1.25rem; text-align: center; }
  .dashboard-logout {
    background: #ffc107;
    border: 0;
    border-radius: .65rem;
    color: #212529;
    font-weight: 700;
    padding: .85rem 1rem;
  }
  .dashboard-logout:hover { background: #e0a800; }
`;

export default function Profile({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [viewedProducts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ethioshop_viewed_products') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  if (!user || !hasValidSession()) {
    return <Navigate to="/login" replace />;
  }

  const sections = [
    { id: 'profile', label: 'My Profile', icon: UserRound },
    { id: 'orders', label: 'My Orders', icon: PackageOpen },
    { id: 'viewed', label: 'Viewed Products', icon: History },
  ];

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="container account-dashboard py-4 py-lg-5">
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-0">My Dashboard</h1>
        </div>

        <div className="row g-4 align-items-stretch">
          <aside className="col-12 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 p-lg-4 dashboard-sidebar d-flex flex-column">
                <div className="d-flex align-items-center gap-3 px-2 pb-3 mb-3 border-bottom">
                  <span className="rounded-circle bg-warning-subtle d-inline-flex align-items-center justify-content-center text-dark fw-bold"
                    style={{ width: 48, height: 48 }}>
                    {(user.fullName || user.name || user.email || 'C').charAt(0).toUpperCase()}
                  </span>
                  <div className="overflow-hidden">
                    <div className="fw-bold text-truncate">{user.fullName || user.name || 'Customer'}</div>
                    <small className="text-muted text-truncate d-block">{user.email}</small>
                  </div>
                </div>

                <nav className="d-grid gap-1" aria-label="Dashboard sections">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        className={`dashboard-nav-button ${activeSection === section.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(section.id)}
                        aria-current={activeSection === section.id ? 'page' : undefined}
                      >
                        <Icon size={19} aria-hidden="true" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>

                <button type="button" className="dashboard-logout mt-3" onClick={onLogout}>
                  <LogOut size={18} className="me-2" aria-hidden="true" />
                  Log Out
                </button>
              </div>
            </div>
          </aside>

          <section className="col-12 col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 p-md-4 p-lg-5">
                {activeSection === 'profile' && (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div>
                        <h2 className="h4 fw-bold mb-1">My Profile</h2>
                        <p className="text-muted mb-0">Your account information</p>
                      </div>
                    </div>
                    <div className="d-grid gap-3">
                      <div className="d-flex align-items-center gap-3 border rounded-3 p-3">
                        <UserRound className="text-warning flex-shrink-0" size={22} aria-hidden="true" />
                        <span className="fw-semibold">{user.fullName || user.name || 'Customer'}</span>
                        <span className="visually-hidden">Full name</span>
                      </div>
                      <div className="d-flex align-items-center gap-3 border rounded-3 p-3">
                        <AtSign className="text-warning flex-shrink-0" size={22} aria-hidden="true" />
                        <span className="fw-semibold text-break">{user.email || 'Not provided'}</span>
                        <span className="visually-hidden">Email address</span>
                      </div>
                      <div className="d-flex align-items-center gap-3 border rounded-3 p-3">
                        <Phone className="text-warning flex-shrink-0" size={22} aria-hidden="true" />
                        <span className="fw-semibold">{user.phoneNumber || 'Not provided'}</span>
                        <span className="visually-hidden">Phone number</span>
                      </div>
                    </div>
                  </>
                )}

                {activeSection === 'orders' && (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="text-warning"><PackageOpen size={30} aria-hidden="true" /></span>
                      <h2 className="h4 fw-bold mb-0">My Orders</h2>
                    </div>
                    <Orders />
                  </>
                )}

                {activeSection === 'viewed' && (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <span className="text-warning"><History size={30} aria-hidden="true" /></span>
                      <div>
                        <h2 className="h4 fw-bold mb-1">Viewed Products</h2>
                        <p className="text-muted mb-0">Products you recently explored</p>
                      </div>
                    </div>
                    {viewedProducts.length === 0 ? (
                      <div className="text-center bg-light rounded-4 py-5 px-3">
                        <EyeOff size={44} className="text-secondary mb-3" aria-hidden="true" />
                        <p className="fw-semibold mb-1">No viewed products yet</p>
                        <p className="text-muted mb-0">Products you open will appear here.</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {viewedProducts.map((product) => (
                          <article className="col-12 col-sm-6 col-xl-4" key={product.id}>
                            <div className="card h-100 border rounded-3 overflow-hidden">
                              <div className="bg-light d-flex align-items-center justify-content-center p-3" style={{ height: 170 }}>
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="img-fluid h-100" style={{ objectFit: 'contain' }} />
                                ) : (
                                  <Shirt size={42} className="text-secondary" aria-hidden="true" />
                                )}
                              </div>
                              <div className="card-body">
                                <small className="text-muted">{product.category}</small>
                                <h3 className="h6 fw-bold mt-1">{product.name}</h3>
                                <p className="fw-semibold mb-0">{product.price.toLocaleString()} ETB</p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
