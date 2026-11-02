import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const TipDetail = () => {
  const { id } = useParams();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedTips, setRelatedTips] = useState([]);

  useEffect(() => {
    const fetchTipData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tips/${id}`);
        if (res.data.success) {
          setTip(res.data.data);

          // Fetch related in same category
          const relatedRes = await api.get(`/tips?category=${encodeURIComponent(res.data.data.category)}`);
          if (relatedRes.data.success) {
            setRelatedTips(relatedRes.data.data.filter((t) => t.id !== parseInt(id, 10)).slice(0, 2));
          }
        }
      } catch (err) {
        console.error('Error fetching tip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <Loader message="Opening beauty guide..." />;
  }

  if (!tip) {
    return (
      <div className="container py-5 text-center">
        <h3 className="mb-3">Beauty tip not found</h3>
        <Link to="/tips" className="btn btn-glow">
          Back to Tips
        </Link>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="max-w-800 mx-auto">
          {/* Back link */}
          <Link to="/tips" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1 mb-4">
            <i className="bi bi-chevron-left"></i> Back to all beauty guides
          </Link>

          {/* Article Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-pill-pink">{tip.category}</span>
              <span className="text-muted small">• 4 min read • Updated {new Date(tip.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="display-6 fw-bold mb-3 font-heading" style={{ lineHeight: 1.3 }}>
              {tip.title}
            </h1>
          </div>

          {/* Featured Image */}
          {tip.imageUrl && (
            <div className="rounded-4 overflow-hidden mb-5 shadow-sm" style={{ maxHeight: '420px' }}>
              <img src={tip.imageUrl} alt={tip.title} className="w-100 h-100 object-fit-cover" />
            </div>
          )}

          {/* Article Body Content */}
          <div className="glow-card p-4 p-md-5 mb-5 bg-white">
            <div className="article-body" style={{ whiteSpace: 'pre-line', fontSize: '1.08rem', lineHeight: 1.8 }}>
              {tip.content}
            </div>
          </div>

          {/* Share & Routine CTA */}
          <div className="p-4 rounded-4 bg-glow-pink d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-5">
            <div>
              <h5 className="fw-bold mb-1 font-heading">Ready to enhance your glow?</h5>
              <p className="text-muted small mb-0">Check out targeted skincare products formulated for these techniques.</p>
            </div>
            <Link to="/products" className="btn btn-glow flex-shrink-0">
              Browse Formulations
            </Link>
          </div>

          {/* Related Articles */}
          {relatedTips.length > 0 && (
            <div className="pt-4 border-top">
              <h4 className="fw-bold mb-3 font-heading">Related in {tip.category}</h4>
              <div className="row g-3">
                {relatedTips.map((r) => (
                  <div key={r.id} className="col-md-6">
                    <Link to={`/tips/${r.id}`} className="text-decoration-none">
                      <div className="glow-card p-3 h-100 d-flex gap-3 align-items-center">
                        {r.imageUrl && (
                          <img
                            src={r.imageUrl}
                            alt={r.title}
                            className="rounded-3 object-fit-cover flex-shrink-0"
                            style={{ width: '70px', height: '70px' }}
                          />
                        )}
                        <div>
                          <h6 className="fw-bold mb-1 text-dark line-clamp-2">{r.title}</h6>
                          <span className="small text-danger fw-semibold">Read Now →</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipDetail;
