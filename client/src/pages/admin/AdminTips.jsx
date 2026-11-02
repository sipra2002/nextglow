import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const CATEGORIES = ['Makeup', 'Haircare', 'Natural Skincare', 'Articles'];

const AdminTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Articles',
    content: '',
    imageUrl: '',
    popular: false,
  });

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tips');
      if (res.data.success) {
        setTips(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedTip(null);
    setFormData({
      title: '',
      category: 'Articles',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      popular: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditing(true);
    setSelectedTip(t);
    setFormData({
      title: t.title,
      category: t.category,
      content: t.content,
      imageUrl: t.imageUrl || '',
      popular: t.popular,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required.');
      return;
    }

    try {
      setSaving(true);
      if (isEditing && selectedTip) {
        await api.put(`/tips/${selectedTip.id}`, formData);
        toast.success('Beauty guide updated successfully!');
      } else {
        await api.post('/tips', formData);
        toast.success('New beauty guide published!');
      }
      setShowModal(false);
      fetchTips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save tip.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/tips/${deleteId}`);
      toast.success('Tip deleted.');
      setDeleteId(null);
      fetchTips();
    } catch (err) {
      toast.error('Failed to delete tip.');
    }
  };

  const filteredTips = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
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
            <h2 className="mb-0 font-heading">Beauty Tips & Publications</h2>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-glow">
            <i className="bi bi-plus-lg me-1"></i> New Publication
          </button>
        </div>

        {/* Filter */}
        <div className="glow-card p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 small"
                  placeholder="Filter articles by headline or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end text-muted small">
              Total Published Guides: <strong>{tips.length}</strong>
            </div>
          </div>
        </div>

        {/* Tips Table */}
        {loading ? (
          <Loader message="Loading beauty guides..." />
        ) : (
          <div className="glow-card bg-white shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Article</th>
                    <th>Category</th>
                    <th>Popular Status</th>
                    <th>Published On</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTips.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {t.imageUrl && (
                            <img
                              src={t.imageUrl}
                              alt={t.title}
                              className="rounded-3 object-fit-cover flex-shrink-0"
                              style={{ width: '48px', height: '48px' }}
                            />
                          )}
                          <div>
                            <span className="fw-bold small text-dark d-block text-truncate" style={{ maxWidth: '300px' }}>
                              {t.title}
                            </span>
                            <span className="text-muted small">ID #{t.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-pill-pink small">{t.category}</span>
                      </td>
                      <td>
                        {t.popular ? (
                          <span className="badge bg-danger rounded-pill">🔥 Popular</span>
                        ) : (
                          <span className="badge bg-light text-muted rounded-pill">Standard</span>
                        )}
                      </td>
                      <td className="small text-muted">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="btn btn-sm btn-outline-secondary rounded-pill me-2"
                          title="Edit Tip"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          title="Delete Tip"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Tip Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Publication #${selectedTip?.id}` : 'Create New Beauty Guide'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Article Title *</label>
                        <input
                          type="text"
                          className="form-control rounded-pill small"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Category *</label>
                        <select
                          className="form-select rounded-pill small"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Header Image URL</label>
                        <input
                          type="url"
                          className="form-control rounded-pill small"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Article Content (Markdown / Text) *</label>
                        <textarea
                          rows="6"
                          className="form-control rounded-4 small"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.popular}
                            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                            id="popularCheck"
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="popularCheck">
                            Highlight as Popular / Trending Tutorial
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn btn-glow rounded-pill px-4">
                      {saving ? 'Publishing...' : isEditing ? 'Update Guide' : 'Publish Article'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-body p-4 text-center">
                  <div className="fs-1 text-danger mb-2">⚠️</div>
                  <h5 className="fw-bold mb-2">Confirm Delete</h5>
                  <p className="text-muted small mb-4">
                    Are you sure you want to delete this publication from the GlowUp journal?
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button onClick={() => setDeleteId(null)} className="btn btn-light rounded-pill px-4">
                      Cancel
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger rounded-pill px-4">
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTips;
