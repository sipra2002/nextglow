import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please sign in to add products to your cart');
      navigate('/login');
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const skinTypes = Array.isArray(product.skinTypes)
    ? product.skinTypes
    : typeof product.skinTypes === 'string'
    ? product.skinTypes.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="product-card">
      {/* Featured Badge */}
      {product.featured && <span className="badge-featured">Featured</span>}

      {/* Product Image */}
      <div className="product-img-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Category & Skin Type Badges */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge-pill-pink">
              {product.category?.name || 'Skincare'}
            </span>
            <span className="text-muted small fw-semibold">
              In Stock: {product.stock}
            </span>
          </div>

          <h5 className="fs-6 fw-bold mb-1 text-dark line-clamp-1" title={product.name}>
            {product.name}
          </h5>

          <p className="text-muted small mb-2" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4',
            minHeight: '2.8em',
          }}>
            {product.description}
          </p>

          {/* Skin Type tags */}
          <div className="mb-3">
            {skinTypes.slice(0, 3).map((st, idx) => (
              <span key={idx} className="badge-skin-type">
                {st}
              </span>
            ))}
            {skinTypes.length > 3 && (
              <span className="badge-skin-type">+{skinTypes.length - 3}</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light">
          <div>
            <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>Price</span>
            <span className="fs-5 fw-bold" style={{ color: '#E91E63' }}>
              ₹{product.price}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="btn btn-sm btn-glow px-3 py-2"
            title="Add to Cart"
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : product.stock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <i className="bi bi-cart-plus me-1"></i> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
