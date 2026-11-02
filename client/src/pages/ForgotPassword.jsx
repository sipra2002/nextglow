import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data.data?.devToken) {
        setDevToken(res.data.data.devToken);
      }
      toast.info('Password reset instructions generated.');
    } catch (err) {
      toast.error('Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="glow-card p-4 p-md-5 bg-white shadow-sm">
              <div className="text-center mb-4">
                <span className="brand-logo justify-content-center mb-2">
                  <span className="brand-logo-sparkle">🌸</span> GlowUp
                </span>
                <h3 className="fw-bold font-heading">Reset Password</h3>
                <p className="text-muted small">Enter your email and we will issue a secure reset link</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Registered Email</label>
                    <input
                      type="email"
                      className="form-control rounded-pill px-3 py-2 small"
                      placeholder="e.g. pooja@glowup.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-glow w-100 py-2 rounded-pill mt-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Submitting...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="alert alert-success small mb-3">
                    If <strong>{email}</strong> exists in our records, a 15-minute single-use reset token has been created.
                  </div>

                  {devToken && (
                    <div className="p-3 rounded-3 bg-light border border-dashed mb-4 text-start">
                      <span className="badge bg-secondary mb-1">Development Demo Helper</span>
                      <p className="small text-muted mb-2">
                        In accordance with the PRD specification, real external emails are simulated. Click the generated token link below:
                      </p>
                      <Link
                        to={`/reset-password/${devToken}`}
                        className="btn btn-sm btn-outline-danger w-100 rounded-pill text-truncate"
                      >
                        Reset Password with Demo Token →
                      </Link>
                    </div>
                  )}

                  <Link to="/login" className="btn btn-light rounded-pill px-4 small">
                    Return to Login
                  </Link>
                </div>
              )}

              <div className="text-center mt-4 pt-3 border-top border-light small text-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
