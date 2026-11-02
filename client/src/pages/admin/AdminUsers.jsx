import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <Link to="/admin" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1 mb-1">
              <i className="bi bi-chevron-left"></i> Back to Dashboard
            </Link>
            <h2 className="mb-0 font-heading">Registered Customer Directory</h2>
            <p className="text-muted small mb-0">Read-only view of customer accounts and diagnosed skin types.</p>
          </div>
        </div>

        {/* Search */}
        <div className="glow-card p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 small"
                  placeholder="Filter users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end text-muted small">
              Total Customer Profiles: <strong>{users.length}</strong>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <Loader message="Loading customer directory..." />
        ) : (
          <div className="glow-card bg-white shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Contact Phone</th>
                    <th>Diagnosed Skin Type</th>
                    <th>Role</th>
                    <th className="text-end">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white small fw-bold"
                            style={{ width: '36px', height: '36px', backgroundColor: u.role === 'ADMIN' ? '#E91E63' : '#757575' }}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="fw-bold small text-dark d-block">{u.name}</span>
                            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>ID #{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="small text-muted">{u.email}</td>
                      <td className="small">{u.phone || <span className="text-muted">—</span>}</td>
                      <td>
                        {u.skinProfile?.skinType ? (
                          <span className="badge-skin-type">{u.skinProfile.skinType}</span>
                        ) : (
                          <span className="text-muted small">Not taken yet</span>
                        )}
                      </td>
                      <td>
                        {u.role === 'ADMIN' ? (
                          <span className="badge bg-danger rounded-pill px-3 py-1">ADMIN</span>
                        ) : (
                          <span className="badge bg-light text-muted border rounded-pill px-3 py-1">CUSTOMER</span>
                        )}
                      </td>
                      <td className="text-end small text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
