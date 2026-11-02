import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfileData, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skinProfile, setSkinProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userRes, skinRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/skin/me'),
        ]);

        if (userRes.data.success) {
          setProfile(userRes.data.data);
          setName(userRes.data.data.name || '');
          setPhone(userRes.data.data.phone || '');
        }

        if (skinRes.data.success && skinRes.data.data) {
          setSkinProfile(skinRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/users/me', { name, phone });
      if (res.data.success) {
        updateProfileData(res.data.data);
        toast.success('Profile details updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading your GlowUp profile..." />;
  }

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="max-w-900 mx-auto">
          {/* Header Card */}
          <div className="glow-card p-4 p-md-5 mb-4 bg-white shadow-sm">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fs-2 fw-bold"
                  style={{ width: '70px', height: '70px', backgroundColor: '#E91E63' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="fw-bold mb-1 font-heading">{profile?.name}</h3>
                  <p className="text-muted small mb-0">
                    {profile?.email} • Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  <span className="badge rounded-pill bg-light text-dark border mt-2 small">
                    Role: {profile?.role}
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link to="/cart" className="btn btn-outline-secondary rounded-pill px-3 py-2 small">
                  <i className="bi bi-bag-heart me-1 text-danger"></i> My Bag
                </Link>
                <button onClick={logout} className="btn btn-outline-danger rounded-pill px-3 py-2 small">
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Skin Profile Card */}
            <div className="col-lg-6">
              <div className="glow-card p-4 h-100 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 font-heading">
                    <i className="bi bi-stars text-danger me-2"></i> Skin Diagnosis
                  </h5>
                  <Link to="/skin-analysis" className="btn btn-sm btn-link text-danger text-decoration-none p-0">
                    {skinProfile ? 'Retake Quiz' : 'Take Quiz'} →
                  </Link>
                </div>

                {skinProfile ? (
                  <div>
                    <div className="p-3 rounded-4 mb-3" style={{ backgroundColor: '#FFF0F5', border: '1px solid #F8BBD0' }}>
                      <span className="badge-pill-pink mb-2 d-inline-block">Verified Skin Type</span>
                      <h4 className="fw-bold mb-1" style={{ color: '#C2185B' }}>
                        {skinProfile.skinType} SKIN
                      </h4>
                      <p className="text-muted small mb-0">
                        {skinProfile.suggestions?.title}: {skinProfile.suggestions?.description}
                      </p>
                    </div>

                    <div className="mb-3">
                      <h6 className="small fw-bold text-muted text-uppercase">Recommended Actives:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {skinProfile.suggestions?.ingredients?.map((ing, i) => (
                          <span key={i} className="badge-skin-type">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link to="/products" className="btn btn-glow-soft btn-sm w-100 rounded-pill text-center py-2">
                      View Matching Products
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="fs-1 mb-2">🌸</div>
                    <h6 className="fw-bold">No skin analysis recorded yet</h6>
                    <p className="text-muted small mb-3">
                      Take our 2-minute diagnostic questionnaire to save your custom skin profile and get personalized routines.
                    </p>
                    <Link to="/skin-analysis" className="btn btn-glow btn-sm px-4">
                      Start Skin Quiz
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Edit Form */}
            <div className="col-lg-6">
              <div className="glow-card p-4 h-100 bg-white shadow-sm">
                <h5 className="fw-bold mb-3 font-heading">
                  <i className="bi bi-person-gear text-danger me-2"></i> Personal Details
                </h5>

                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-pill px-3 py-2 small"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      className="form-control rounded-pill px-3 py-2 small bg-light"
                      value={profile?.email || ''}
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control rounded-pill px-3 py-2 small"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-glow btn-sm w-100 py-2 rounded-pill"
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
