import React from 'react';

const Loader = ({ message = 'Loading radiant glow...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-danger mb-3"
        style={{ width: '3rem', height: '3rem', color: '#E91E63' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium small mb-0">{message}</p>
    </div>
  );
};

export default Loader;
