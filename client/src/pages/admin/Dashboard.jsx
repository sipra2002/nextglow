import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    tipsCount: 0,
    featuredCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const [usersRes, productsRes, tipsRes] = await Promise.all([
          api.get('/users'),
          api.get('/products'),
          api.get('/tips'),
        ]);

        const products = productsRes.data.data || [];
        setStats({
          usersCount: usersRes.data.data?.length || 0,
          productsCount: products.length,
          tipsCount: tipsRes.data.data?.length || 0,
          featuredCount: products.filter((p) => p.featured).length,
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <Loader message="Accessing GlowUp Admin Analytics..." />;
  }

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="badge bg-danger rounded-pill px-3 py-2 small mb-2" style={{ backgroundColor: '#E91E63' }}>
              👑 Administrator Console
            </span>
            <h1 className="mb-1 font-heading">GlowUp Operations Dashboard</h1>
            <p className="text-muted small mb-0">Overview of catalogue inventory, beauty publications, and customer database.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/products" className="btn btn-glow btn-sm">
              <i className="bi bi-box-seam me-1"></i> Manage Products
            </Link>
            <Link to="/admin/tips" className="btn btn-glow-outline btn-sm">
              <i className="bi bi-journal-text me-1"></i> Manage Tips
            </Link>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="row g-4 mb-5">
          <div className="col-sm-6 col-lg-3">
            <div className="glow-card p-4 bg-white shadow-sm h-100 border-start border-4 border-danger">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Total Users</span>
                <i className="bi bi-people-fill text-danger fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1 font-heading">{stats.usersCount}</h2>
              <span className="small text-muted">Registered accounts</span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glow-card p-4 bg-white shadow-sm h-100 border-start border-4 border-primary">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Active Products</span>
                <i className="bi bi-boxes text-primary fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1 font-heading">{stats.productsCount}</h2>
              <span className="small text-muted">{stats.featuredCount} marked as featured</span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glow-card p-4 bg-white shadow-sm h-100 border-start border-4 border-success">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Beauty Tips</span>
                <i className="bi bi-journal-bookmark-fill text-success fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1 font-heading">{stats.tipsCount}</h2>
              <span className="small text-muted">Published articles</span>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glow-card p-4 bg-white shadow-sm h-100 border-start border-4 border-warning">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold text-uppercase">API Status</span>
                <i className="bi bi-check-circle-fill text-warning fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1 font-heading text-success">Healthy</h2>
              <span className="small text-muted">Prisma + SQLite / Postgres</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="glow-card p-4 bg-white shadow-sm h-100">
              <div className="fs-1 mb-2">🛍️</div>
              <h5 className="fw-bold font-heading">Product Catalogue</h5>
              <p className="text-muted small mb-4">
                Add new skincare items, update pricing in INR, manage stock levels, and assign suitable skin types.
              </p>
              <Link to="/admin/products" className="btn btn-glow-soft w-100 text-center">
                Open Product Manager →
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glow-card p-4 bg-white shadow-sm h-100">
              <div className="fs-1 mb-2">✍️</div>
              <h5 className="fw-bold font-heading">Beauty Tips & Tutorials</h5>
              <p className="text-muted small mb-4">
                Publish editorial tutorials, haircare recipes, makeup preps, and manage popular reader highlights.
              </p>
              <Link to="/admin/tips" className="btn btn-glow-soft w-100 text-center">
                Open Tips Manager →
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glow-card p-4 bg-white shadow-sm h-100">
              <div className="fs-1 mb-2">👥</div>
              <h5 className="fw-bold font-heading">Registered Customers</h5>
              <p className="text-muted small mb-4">
                View registered users, contact phone numbers, diagnosed skin profiles, and account creation dates.
              </p>
              <Link to="/admin/users" className="btn btn-glow-soft w-100 text-center">
                View User Directory →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
