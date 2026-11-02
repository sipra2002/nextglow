import React from 'react';
import { Link } from 'react-router-dom';

const TipCard = ({ tip }) => {
  return (
    <div className="tip-card">
      <div className="tip-img-wrap">
        {tip.imageUrl ? (
          <img src={tip.imageUrl} alt={tip.title} className="tip-img" loading="lazy" />
        ) : (
          <div className="w-100 h-100 bg-glow-pink d-flex align-items-center justify-content-center">
            <span className="fs-1">🌸</span>
          </div>
        )}
        {tip.popular && (
          <span
            className="badge rounded-pill position-absolute top-0 end-0 m-3 px-3 py-2 fw-semibold"
            style={{ backgroundColor: '#E91E63', color: '#fff', fontSize: '0.75rem' }}
          >
            🔥 Popular Read
          </span>
        )}
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge-pill-pink">{tip.category}</span>
            <span className="text-muted small">• 3 min read</span>
          </div>

          <h5 className="fs-6 fw-bold mb-2 text-dark font-heading" style={{ lineHeight: 1.35 }}>
            {tip.title}
          </h5>

          <p
            className="text-muted small mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.5',
            }}
          >
            {tip.content}
          </p>
        </div>

        <div className="pt-2 border-top border-light">
          <Link
            to={`/tips/${tip.id}`}
            className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
            style={{ color: '#E91E63' }}
          >
            Read Full Guide <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
