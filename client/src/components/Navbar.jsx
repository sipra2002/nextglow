import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNav = () => setIsNavOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-glow sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeNav}>
          <span className="brand-logo-sparkle">🌸</span>
          <span>GlowUp</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${isNavOpen ? 'bi-x-lg' : 'bi-list'} fs-2`} style={{ color: '#E91E63' }}></i>
        </button>

        {/* Navbar Links & Actions */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="glowupNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeNav}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/skin-analysis"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                <span className="badge rounded-pill bg-danger me-1 small" style={{ backgroundColor: '#E91E63' }}>
                  AI Quiz
                </span>
                Skin Analysis
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/routine"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                Daily Routine
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tips"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                Beauty Tips
              </NavLink>
            </li>

            {/* Admin Link if admin */}
            {isAdmin && (
              <li className="nav-item ms-lg-2">
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link text-warning-emphasis fw-bold ${isActive ? 'active' : ''}`}
                  onClick={closeNav}
                >
                  <i className="bi bi-shield-lock-fill me-1 text-danger"></i> Admin Portal
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Icons */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Cart Icon with Counter */}
            <Link
              to="/cart"
              className="position-relative text-dark d-flex align-items-center p-2 rounded-circle bg-light"
              style={{ textDecoration: 'none' }}
              onClick={closeNav}
              title="View Cart"
            >
              <i className="bi bi-bag-heart fs-5" style={{ color: '#E91E63' }}></i>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ backgroundColor: '#E91E63', color: '#fff', fontSize: '0.7rem' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown or Auth Buttons */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-glow-soft d-flex align-items-center gap-2 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="fw-semibold small">{user.name?.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4 p-2 mt-2">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold small text-truncate" style={{ maxWidth: '180px' }}>
                      {user.name}
                    </p>
                    <span className="text-muted small text-truncate d-block" style={{ maxWidth: '180px' }}>
                      {user.email}
                    </span>
                    {user.skinProfile?.skinType && (
                      <span className="badge-skin-type mt-1">Skin: {user.skinProfile.skinType}</span>
                    )}
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item py-2 rounded-3 small" onClick={closeNav}>
                      <i className="bi bi-person me-2 text-danger"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="dropdown-item py-2 rounded-3 small" onClick={closeNav}>
                      <i className="bi bi-bag-check me-2 text-danger"></i> My Shopping Cart
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin" className="dropdown-item py-2 rounded-3 small text-danger fw-semibold" onClick={closeNav}>
                        <i className="bi bi-gear-wide-connected me-2"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button className="dropdown-item py-2 rounded-3 text-danger small" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 fw-medium" onClick={closeNav}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-glow px-3 py-2" onClick={closeNav}>
                  Join GlowUp
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
