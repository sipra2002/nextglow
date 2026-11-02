import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Face Wash', 'Moisturizer', 'Sunscreen', 'Serum', 'Lip Care'];
const SKIN_TYPES = ['All', 'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedSkinType !== 'All') params.append('skinType', selectedSkinType.toUpperCase());

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 250);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory, selectedSkinType]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-pill-pink mb-2 d-inline-block">The Catalogue</span>
          <h1 className="mb-2">Clean Formulations for Glowing Skin</h1>
          <p className="text-muted">
            Explore dermatologically formulated essentials in Indian Rupees (₹), categorized for your skin concerns.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glow-card p-4 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            {/* Search Bar */}
            <div className="col-lg-5 col-md-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products by active ingredients, name..."
              />
            </div>

            {/* Skin Type Filter */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2">
                <label className="text-muted small fw-semibold flex-shrink-0">Skin Type:</label>
                <select
                  className="form-select rounded-pill small"
                  value={selectedSkinType}
                  onChange={(e) => setSelectedSkinType(e.target.value)}
                >
                  {SKIN_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st === 'All' ? 'All Skin Types' : `${st} Skin`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="col-lg-3 col-md-12 text-lg-end">
              <div className="d-flex align-items-center justify-content-lg-end gap-2">
                <label className="text-muted small fw-semibold flex-shrink-0">Sort By:</label>
                <select
                  className="form-select rounded-pill small"
                  style={{ maxWidth: '180px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="d-flex flex-wrap gap-2 pt-3 mt-3 border-top border-light">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Count and Results */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small">
            Showing <strong className="text-dark">{sortedProducts.length}</strong> skincare products
          </span>
          {(selectedCategory !== 'All' || selectedSkinType !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSkinType('All');
                setSearchQuery('');
              }}
              className="btn btn-sm btn-link text-danger text-decoration-none p-0"
            >
              <i className="bi bi-x-circle me-1"></i> Clear all filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <Loader message="Loading fresh product catalogue..." />
        ) : sortedProducts.length === 0 ? (
          <div className="glow-card p-5 text-center my-4 bg-white">
            <div className="fs-1 mb-3">🔍</div>
            <h4 className="fw-bold mb-2">No matching products found</h4>
            <p className="text-muted small mb-4">
              Try adjusting your search keywords, clearing skin type filters, or exploring other categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSkinType('All');
                setSearchQuery('');
              }}
              className="btn btn-glow-soft px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {sortedProducts.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
