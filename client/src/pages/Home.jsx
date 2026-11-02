import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import TipCard from '../components/TipCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularTips, setPopularTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [productsRes, tipsRes] = await Promise.all([
          api.get('/products?featured=true'),
          api.get('/tips?popular=true'),
        ]);

        if (productsRes.data.success) {
          setFeaturedProducts(productsRes.data.data.slice(0, 4));
        }
        if (tipsRes.data.success) {
          setPopularTips(tipsRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill px-3 py-2 mb-3 fw-semibold" style={{ backgroundColor: '#FDE7EF', color: '#E91E63', border: '1px solid #F8BBD0' }}>
                ✨ Science-Backed Botanical Skincare
              </span>
              <h1 className="hero-title">
                Radiate Confidence, <span>Glow Naturally</span>
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>
                Discover skincare crafted for real skin barriers. Take our 2-minute clinical skin quiz for tailored formulas, or explore our cruelty-free dermatological collection.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/skin-analysis" className="btn btn-glow btn-lg px-4 py-3">
                  <i className="bi bi-stars"></i> Analyze Your Skin
                </Link>
                <Link to="/products" className="btn btn-glow-outline btn-lg px-4 py-3">
                  Shop Best Sellers
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="row g-3 pt-3 border-top border-light">
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">50k+</h4>
                  <p className="text-muted small mb-0">Happy Glowers</p>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">100%</h4>
                  <p className="text-muted small mb-0">Clean Actives</p>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">4.9 ★</h4>
                  <p className="text-muted small mb-0">Derm Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="col-lg-6 position-relative">
              <div className="hero-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                  alt="GlowUp Skincare Routine"
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: '440px' }}
                />
              </div>

              {/* Floating Badge */}
              <div className="hero-floating-badge d-none d-sm-flex">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '48px', height: '48px', backgroundColor: '#FDE7EF', color: '#E91E63' }}
                >
                  <i className="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Dermatologist Verified</h6>
                  <p className="text-muted small mb-0">pH Balanced & Non-Comedogenic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Quiz Interactive Callout */}
      <section className="py-5" style={{ backgroundColor: '#F5EBE0' }}>
        <div className="container">
          <div className="glow-card p-4 p-md-5 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 100%)' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="badge rounded-pill bg-danger px-3 py-2 small mb-2" style={{ backgroundColor: '#E91E63' }}>
                  Personalized Skincare Diagnostic
                </span>
                <h2 className="mb-2">Don't guess what your skin needs.</h2>
                <p className="text-muted mb-0 lead" style={{ fontSize: '1.05rem' }}>
                  Answer 8 quick questions about oiliness, tightness, and pore appearance. Our algorithm computes your exact skin type (Normal, Dry, Oily, Combination, or Sensitive) and builds your routine.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/skin-analysis" className="btn btn-glow btn-lg px-4 py-3">
                  Take The Free Quiz <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge-pill-pink mb-2 d-inline-block">Curated Formulas</span>
              <h2 className="mb-1">Featured Best Sellers</h2>
              <p className="text-muted mb-0">High-potency cleansers, hydrators, and sun defense.</p>
            </div>
            <Link to="/products" className="btn btn-glow-outline mt-3 mt-md-0">
              View All Products ({featuredProducts.length}+) <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading best sellers..." />
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Routine Preview Section */}
      <section className="py-5 bg-glow-beige">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge-pill-pink mb-2 d-inline-block">Daily Rituals</span>
            <h2>Two Simple Steps to Flawless Skin</h2>
            <p className="text-muted">Master the golden skincare sequence for daytime defense and overnight repair.</p>
          </div>

          <div className="row g-4">
            {/* Morning */}
            <div className="col-lg-6">
              <div className="glow-card p-4 p-md-5 h-100" style={{ borderLeft: '6px solid #FF9800' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FFF3E0', color: '#E65100', width: '56px', height: '56px' }}>
                    <i className="bi bi-sun-fill fs-3"></i>
                  </div>
                  <div>
                    <h4 className="mb-0">Morning Defense Routine</h4>
                    <span className="text-muted small">Protect, Hydrate & Illuminate</span>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Shield against blue light, environmental pollution, and UV radiation while sealing in hydration for an all-day dew.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-light text-dark p-2">1. Gentle Cleanser</span>
                  <span className="badge bg-light text-dark p-2">2. Hydrating Toner</span>
                  <span className="badge bg-light text-dark p-2">3. Vitamin C Serum</span>
                  <span className="badge bg-light text-dark p-2">4. Gel Moisturizer</span>
                  <span className="badge bg-danger text-white p-2" style={{ backgroundColor: '#E91E63' }}>5. SPF 50+ Sunscreen</span>
                </div>
                <Link to="/routine" className="text-decoration-none fw-semibold small text-dark d-inline-flex align-items-center gap-1">
                  View Full Morning Guide <i className="bi bi-arrow-right text-danger"></i>
                </Link>
              </div>
            </div>

            {/* Night */}
            <div className="col-lg-6">
              <div className="glow-card p-4 p-md-5 h-100" style={{ borderLeft: '6px solid #3F51B5' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#E8EAF6', color: '#1A237E', width: '56px', height: '56px' }}>
                    <i className="bi bi-moon-stars-fill fs-3"></i>
                  </div>
                  <div>
                    <h4 className="mb-0">Night Recovery Ritual</h4>
                    <span className="text-muted small">Deep Cleanse & Barrier Restoration</span>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Support overnight cellular renewal by melting away dirt, replenishing essential ceramides, and treating lips.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-light text-dark p-2">1. Cleansing Balm</span>
                  <span className="badge bg-light text-dark p-2">2. Low pH Cleanser</span>
                  <span className="badge bg-light text-dark p-2">3. Restorative Serum</span>
                  <span className="badge bg-light text-dark p-2">4. Ceramide Cream</span>
                  <span className="badge bg-light text-dark p-2">5. Berry Lip Butter</span>
                </div>
                <Link to="/routine" className="text-decoration-none fw-semibold small text-dark d-inline-flex align-items-center gap-1">
                  View Full Night Guide <i className="bi bi-arrow-right text-danger"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Beauty Tips */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge-pill-pink mb-2 d-inline-block">The Glow Journal</span>
              <h2 className="mb-1">Expert Beauty Tutorials</h2>
              <p className="text-muted mb-0">Practical tricks from aesthetic practitioners and cosmetic chemists.</p>
            </div>
            <Link to="/tips" className="btn btn-glow-outline mt-3 mt-md-0">
              Read All Articles <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {popularTips.map((tip) => (
              <div key={tip.id} className="col-12 col-md-4">
                <TipCard tip={tip} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Beauty Ethics Banner */}
      <section className="py-5 bg-white border-top border-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="fs-1 mb-2">🌿</div>
                <h6 className="fw-bold">100% Clean Actives</h6>
                <p className="text-muted small mb-0">No parabens, phthalates, or harsh sulfates.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="fs-1 mb-2">🐰</div>
                <h6 className="fw-bold">Leaping Bunny Certified</h6>
                <p className="text-muted small mb-0">Never tested on animals, 100% cruelty-free.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="fs-1 mb-2">💧</div>
                <h6 className="fw-bold">Dermatologist Verified</h6>
                <p className="text-muted small mb-0">Formulated for pH 5.5 skin acid mantle.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="fs-1 mb-2">📦</div>
                <h6 className="fw-bold">Fast Domestic Shipping</h6>
                <p className="text-muted small mb-0">Free express courier above ₹999 across India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
