import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired token.');
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
                <h3 className="fw-bold font-heading">Set New Password</h3>
                <p className="text-muted small">Choose a strong, secure password for your account</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">New Password</label>
                  <input
                    type="password"
                    className="form-control rounded-pill px-3 py-2 small"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control rounded-pill px-3 py-2 small"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-glow w-100 py-2 rounded-pill fs-6"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Updating...
                    </>
                  ) : (
                    'Save New Password'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top border-light small text-muted">
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

export default ResetPassword;
