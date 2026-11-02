import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
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
                <h3 className="fw-bold font-heading">Welcome Back</h3>
                <p className="text-muted small">Sign in to access your cart and customized skin profile</p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
                </div>
              )}

              {/* Demo Account Quick Buttons */}
              <div className="p-3 rounded-3 mb-4 bg-light border border-dashed text-center">
                <p className="small text-muted mb-2 fw-semibold">Quick Demo Login:</p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin@glowup.com', 'Admin@123')}
                    className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 small"
                  >
                    👑 Admin Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('pooja@glowup.com', 'User@123')}
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 small"
                  >
                    👤 User Demo
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <div className="position-relative">
                    <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="email"
                      className="form-control rounded-pill ps-5 py-2 small"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold mb-0">Password</label>
                    <Link to="/forgot-password" className="text-danger small text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control rounded-pill ps-5 pe-5 py-2 small"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0 text-muted p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-glow w-100 py-2 rounded-pill mt-3 fs-6"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Signing in...
                    </>
                  ) : (
                    'Sign In to GlowUp'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top border-light small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-danger fw-semibold text-decoration-none">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
