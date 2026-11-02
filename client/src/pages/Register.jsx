import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (name.length < 2) {
      setErrorMsg('Full name must be at least 2 characters long.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      setErrorMsg('Password must contain at least one letter and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, phone);
      toast.success('Registration successful! Welcome to GlowUp.');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="glow-card p-4 p-md-5 bg-white shadow-sm">
              <div className="text-center mb-4">
                <span className="brand-logo justify-content-center mb-2">
                  <span className="brand-logo-sparkle">🌸</span> GlowUp
                </span>
                <h3 className="fw-bold font-heading">Join The Glow Club</h3>
                <p className="text-muted small">Create an account to save your skin profiles and enjoy easy checkout</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2 small"
                    placeholder="e.g. Pooja Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control rounded-pill px-3 py-2 small"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    className="form-control rounded-pill px-3 py-2 small"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Password *</label>
                    <input
                      type="password"
                      className="form-control rounded-pill px-3 py-2 small"
                      placeholder="Min 8 chars, 1 num"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control rounded-pill px-3 py-2 small"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-check small mb-4 text-muted">
                  <input className="form-check-input" type="checkbox" defaultChecked id="agreeTerms" required />
                  <label className="form-check-label" htmlFor="agreeTerms">
                    I agree to the GlowUp terms & privacy policy.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-glow w-100 py-2 rounded-pill fs-6"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Creating account...
                    </>
                  ) : (
                    'Create My Free Account'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top border-light small text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
