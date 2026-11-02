import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ALL_SKIN_TYPES = ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    stock: 100,
    featured: false,
    skinTypes: ['NORMAL'],
  });

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) {
        setCategories(catRes.data.data);
        if (catRes.data.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      categoryId: categories[0]?.id || 1,
      stock: 100,
      featured: false,
      skinTypes: ['NORMAL'],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEditing(true);
    setSelectedProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
      stock: p.stock,
      featured: p.featured,
      skinTypes: Array.isArray(p.skinTypes) ? p.skinTypes : ['NORMAL'],
    });
    setShowModal(true);
  };

  const handleSkinTypeToggle = (type) => {
    setFormData((prev) => {
      const exists = prev.skinTypes.includes(type);
      const next = exists ? prev.skinTypes.filter((t) => t !== type) : [...prev.skinTypes, type];
      return { ...prev, skinTypes: next.length > 0 ? next : ['NORMAL'] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageUrl) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);
      if (isEditing && selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, formData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        toast.success('New product added to catalogue!');
      }
      setShowModal(false);
      fetchProductsAndCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product removed.');
      setDeleteId(null);
      fetchProductsAndCategories();
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
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
            <h2 className="mb-0 font-heading">Product Inventory Management</h2>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-glow">
            <i className="bi bi-plus-lg me-1"></i> Add New Product
          </button>
        </div>

        {/* Search Filter */}
        <div className="glow-card p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 small"
                  placeholder="Filter products by title or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end text-muted small">
              Total Products in Inventory: <strong>{products.length}</strong>
            </div>
          </div>
        </div>

        {/* Product Table */}
        {loading ? (
          <Loader message="Loading inventory..." />
        ) : (
          <div className="glow-card bg-white shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Skin Types</th>
                    <th>Featured</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="rounded-3 object-fit-cover flex-shrink-0"
                            style={{ width: '48px', height: '48px' }}
                          />
                          <div>
                            <span className="fw-bold small text-dark d-block text-truncate" style={{ maxWidth: '220px' }}>
                              {p.name}
                            </span>
                            <span className="text-muted small">ID #{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-pill-pink small">{p.category?.name}</span>
                      </td>
                      <td className="fw-semibold text-danger">₹{p.price}</td>
                      <td>
                        <span className={`badge ${p.stock < 20 ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                          {p.skinTypes.map((st, i) => (
                            <span key={i} className="badge-skin-type" style={{ fontSize: '0.65rem' }}>
                              {st}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {p.featured ? (
                          <span className="badge bg-warning text-dark rounded-pill">Yes</span>
                        ) : (
                          <span className="badge bg-light text-muted rounded-pill">No</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-sm btn-outline-secondary rounded-pill me-2"
                          title="Edit Product"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          title="Delete Product"
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

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Product #${selectedProduct?.id}` : 'Add New Skincare Product'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Product Name *</label>
                        <input
                          type="text"
                          className="form-control rounded-pill small"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Category *</label>
                        <select
                          className="form-select rounded-pill small"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Description *</label>
                        <textarea
                          rows="3"
                          className="form-control rounded-4 small"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Price (₹ INR) *</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control rounded-pill small"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Stock Count *</label>
                        <input
                          type="number"
                          className="form-control rounded-pill small"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4 d-flex align-items-center">
                        <div className="form-check form-switch mt-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            id="featuredCheck"
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="featuredCheck">
                            Feature on Home Page
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Image URL (Unsplash / Direct Web Link) *</label>
                        <input
                          type="url"
                          className="form-control rounded-pill small"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold d-block">
                          Suitable Skin Types (Select applicable)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {ALL_SKIN_TYPES.map((type) => {
                            const isChecked = formData.skinTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleSkinTypeToggle(type)}
                                className={`btn btn-sm rounded-pill px-3 ${
                                  isChecked ? 'btn-danger' : 'btn-light border'
                                }`}
                                style={isChecked ? { backgroundColor: '#E91E63', borderColor: '#E91E63' } : {}}
                              >
                                {type} {isChecked ? '✓' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn btn-glow rounded-pill px-4">
                      {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Add to Catalogue'}
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
                    Are you sure you want to permanently remove this product from the GlowUp catalogue?
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

export default AdminProducts;
