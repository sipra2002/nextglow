import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MORNING_STEPS = [
  {
    step: 1,
    title: 'Gentle Cleanse',
    category: 'Face Wash',
    duration: '60 Seconds',
    purpose: 'Remove overnight perspiration and excess sebum while preserving your natural lipid mantle.',
    tip: 'Use lukewarm water. Avoid hot water, which dilates capillaries and strips barrier ceramides.',
    recommendedCategory: 'Face Wash',
  },
  {
    step: 2,
    title: 'Hydrating Essence or Toner',
    category: 'Hydration',
    duration: '30 Seconds',
    purpose: 'Prime the skin with humectants (Glycerin, Beta-Glucan) so subsequent serums absorb 4x deeper.',
    tip: 'Pat gently with clean fingers instead of rubbing with cotton rounds to prevent micro-tears.',
    recommendedCategory: 'Face Wash',
  },
  {
    step: 3,
    title: 'Antioxidant Vitamin C Serum',
    category: 'Serum',
    duration: '1-2 Minutes',
    purpose: 'Neutralize free radicals triggered by UV radiation and blue light while boosting collagen synthesis.',
    tip: 'Let your serum settle for 60 seconds before applying moisturizer to prevent pilling.',
    recommendedCategory: 'Serum',
  },
  {
    step: 4,
    title: 'Barrier Moisturizer',
    category: 'Moisturizer',
    duration: '30 Seconds',
    purpose: 'Lock in humectants and keep your skin plump, resilient, and hydrated under makeup.',
    tip: 'Choose lightweight oil-free gel for oily skin, or a rich ceramide cream for dry skin.',
    recommendedCategory: 'Moisturizer',
  },
  {
    step: 5,
    title: 'Broad-Spectrum SPF 50+',
    category: 'Sunscreen',
    duration: 'Non-Negotiable',
    purpose: 'Defend against UVA (aging) and UVB (burning) rays. The single most powerful anti-aging step.',
    tip: 'Use the two-finger rule (index and middle finger length) to ensure adequate clinical protection.',
    recommendedCategory: 'Sunscreen',
  },
];

const NIGHT_STEPS = [
  {
    step: 1,
    title: 'Double Cleanse (Oil / Balm First)',
    category: 'Face Wash',
    duration: '90 Seconds',
    purpose: 'Melt waterproof SPF, stubborn foundation, and airborne pollutants without tugging the skin.',
    tip: 'Massage cleansing oil on completely dry skin, emulsify with water into a milky texture, then rinse.',
    recommendedCategory: 'Face Wash',
  },
  {
    step: 2,
    title: 'Water-Based Low pH Cleanser',
    category: 'Face Wash',
    duration: '60 Seconds',
    purpose: 'Wash away lingering sweat, dead cell debris, and water-soluble impurities.',
    tip: 'Ensure your cleanser has a pH between 5.0 and 5.5 to protect your microbiome.',
    recommendedCategory: 'Face Wash',
  },
  {
    step: 3,
    title: 'Targeted Night Serum (Niacinamide / Peptides)',
    category: 'Serum',
    duration: '2 Minutes',
    purpose: 'Repair environmental damage and stimulate cellular turnover during biological sleep cycles.',
    tip: 'If using strong actives like Retinol, introduce them slowly (2 times a week initially).',
    recommendedCategory: 'Serum',
  },
  {
    step: 4,
    title: 'Rich Barrier Recovery Cream',
    category: 'Moisturizer',
    duration: '30 Seconds',
    purpose: 'Prevent transepidermal water loss (TEWL) and replenish ceramides while you sleep.',
    tip: 'Warm a nickel-sized amount between your palms before pressing gently into face and neck.',
    recommendedCategory: 'Moisturizer',
  },
  {
    step: 5,
    title: 'Nourishing Lip Sleeping Mask',
    category: 'Lip Care',
    duration: 'Overnight',
    purpose: 'Coat lips in berry antioxidants and plant waxes to dissolve dead dry skin cells overnight.',
    tip: 'Apply generously before bed to wake up to plump, baby-soft lips.',
    recommendedCategory: 'Lip Care',
  },
];

const Routine = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('morning'); // 'morning' | 'night'

  const steps = activeTab === 'morning' ? MORNING_STEPS : NIGHT_STEPS;

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-pill-pink mb-2 d-inline-block">The Daily Guide</span>
          <h1 className="mb-2">Your Morning & Night Skincare Ritual</h1>
          <p className="text-muted">
            The order of product application is just as vital as the active ingredients themselves. Follow our dermatological sequence.
          </p>

          {/* User's Skin Profile banner if available */}
          {user?.skinProfile?.skinType && (
            <div className="alert alert-light border shadow-sm rounded-pill d-inline-flex align-items-center gap-2 mt-2 px-4 py-2">
              <span className="badge-skin-type m-0">Your Profile: {user.skinProfile.skinType} Skin</span>
              <span className="small text-muted">We have tailored step suggestions for your barrier!</span>
            </div>
          )}
        </div>

        {/* Routine Switcher Tabs */}
        <div className="d-flex justify-content-center mb-5">
          <div className="bg-white p-2 rounded-pill shadow-sm border d-inline-flex gap-2" style={{ borderColor: '#E8D9C8' }}>
            <button
              type="button"
              onClick={() => setActiveTab('morning')}
              className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                activeTab === 'morning' ? 'btn-glow' : 'btn-light text-muted'
              }`}
            >
              <i className="bi bi-sun-fill text-warning"></i> Morning Ritual (Protect)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('night')}
              className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                activeTab === 'night' ? 'btn-glow' : 'btn-light text-muted'
              }`}
            >
              <i className="bi bi-moon-stars-fill text-primary"></i> Night Ritual (Repair)
            </button>
          </div>
        </div>

        {/* Routine Steps Grid */}
        <div className="row g-4 mb-5">
          {steps.map((item) => (
            <div key={item.step} className="col-lg-4 col-md-6">
              <div className="routine-step-card d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="routine-step-number">
                      {item.step}
                    </div>
                    <span className="badge-pill-pink small">{item.duration}</span>
                  </div>

                  <h5 className="fw-bold mb-2 font-heading">{item.title}</h5>
                  <p className="text-muted small mb-3">{item.purpose}</p>

                  <div className="p-3 bg-light rounded-3 border-start border-4 border-danger border-opacity-50 mb-3">
                    <p className="mb-0 text-dark small" style={{ fontSize: '0.82rem' }}>
                      <strong className="text-danger">Derm Tip:</strong> {item.tip}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-top border-light mt-auto">
                  <Link
                    to={`/products?category=${encodeURIComponent(item.recommendedCategory)}`}
                    className="small fw-semibold text-decoration-none d-flex align-items-center justify-content-between"
                    style={{ color: '#E91E63' }}
                  >
                    <span>Browse {item.recommendedCategory} Products</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Golden Rules Banner */}
        <div className="glow-card p-4 p-md-5 bg-white shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h3 className="mb-2 font-heading">The Golden Rule: Thinnest to Thickest</h3>
              <p className="text-muted small mb-0">
                Always layer products based on molecular weight: start with watery toners, progress through lightweight water-based serums, followed by emulsion lotions, rich creams, and lastly facial oils or SPF. This ensures deep absorption without occlusion.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/products" className="btn btn-glow px-4 py-2">
                Shop Complete Routine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routine;
