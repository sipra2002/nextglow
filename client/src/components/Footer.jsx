import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to GlowUp Beauty Insider!');
    setEmail('');
  };

  return (
    <footer className="footer-glow">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="brand-logo mb-3 d-inline-flex text-white">
              <span className="brand-logo-sparkle">🌸</span>
              <span className="text-white">GlowUp</span>
            </Link>
            <p className="text-light-emphasis small pe-lg-4 mt-2">
              Empowering your everyday radiance through science-backed dermatological formulations, intelligent skin analysis, and bespoke morning & night rituals.
            </p>
            <div className="d-flex gap-3 mt-3">
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 small fw-semibold">
                🐰 Cruelty Free
              </span>
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 small fw-semibold">
                🌿 Clean Actives
              </span>
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 small fw-semibold">
                ✨ Derm Tested
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Explore</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/">Home Page</Link></li>
              <li><Link to="/skin-analysis">Skin Analysis Quiz</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/routine">Daily Skincare Ritual</Link></li>
              <li><Link to="/tips">Beauty & Wellness Tips</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Categories</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/products?category=Face Wash">Face Wash</Link></li>
              <li><Link to="/products?category=Moisturizer">Moisturizers</Link></li>
              <li><Link to="/products?category=Sunscreen">Sun Protection</Link></li>
              <li><Link to="/products?category=Serum">Active Serums</Link></li>
              <li><Link to="/products?category=Lip Care">Lip Treatments</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-lg-4 col-md-6">
            <h5>Glow Club Newsletter</h5>
            <p className="small text-light-emphasis mb-3">
              Subscribe to unlock dermatologist skincare guides, exclusive product launches, and seasonal routine tips.
            </p>
            <form onSubmit={handleSubscribe} className="d-flex gap-2">
              <input
                type="email"
                className="form-control rounded-pill px-3 py-2 border-0 bg-dark text-white small"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-glow btn-sm px-3 flex-shrink-0">
                Subscribe
              </button>
            </form>
            <p className="small text-muted mt-3 mb-0" style={{ fontSize: '0.78rem' }}>
              🔒 Simulated MCA Final Year Web Project • GlowUp v1.0
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary border-opacity-25 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-2 mb-md-0">
            © {new Date().getFullYear()} GlowUp Skincare & Beauty Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <span>Pink & Beige Palette</span>
            <span>•</span>
            <span>REST API + React 18</span>
            <span>•</span>
            <span>PostgreSQL & Prisma Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
