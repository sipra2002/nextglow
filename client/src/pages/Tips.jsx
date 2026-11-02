import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import TipCard from '../components/TipCard';
import Loader from '../components/Loader';

const TIP_CATEGORIES = ['All', 'Makeup', 'Haircare', 'Natural Skincare', 'Articles'];

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === 'All' ? '/tips' : `/tips?category=${encodeURIComponent(selectedCategory)}`;
        const res = await api.get(url);
        if (res.data.success) {
          setTips(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [selectedCategory]);

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-pill-pink mb-2 d-inline-block">The Editorial Hub</span>
          <h1 className="mb-2">Beauty & Skincare Wisdom</h1>
          <p className="text-muted">
            Expert masterclasses on active ingredient layering, glass skin prep, rosemary scalp care, and holistic home remedies.
          </p>

          {/* Category Filter Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {TIP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        {loading ? (
          <Loader message="Loading beauty tutorials..." />
        ) : tips.length === 0 ? (
          <div className="glow-card p-5 text-center my-4 bg-white">
            <h4 className="fw-bold mb-2">No tutorials in this category yet</h4>
            <p className="text-muted small">Check back soon for new articles!</p>
          </div>
        ) : (
          <div className="row g-4">
            {tips.map((tip) => (
              <div key={tip.id} className="col-12 col-md-6 col-lg-4">
                <TipCard tip={tip} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tips;
