import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Cart = () => {
  const { items, totalItems, subtotal, shipping, grandTotal, loading, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const handleQuantityChange = async (itemId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty <= 0) {
      handleRemove(itemId);
      return;
    }
    try {
      await updateQuantity(itemId, nextQty);
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.info('Item removed from cart');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const handleSimulateCheckout = async () => {
    setOrdering(true);
    setTimeout(async () => {
      await clearCart();
      setOrdering(false);
      setCheckoutModalOpen(false);
      toast.success('🎉 Order placed successfully! (Demonstration Order #GLOW-' + Math.floor(100000 + Math.random() * 900000) + ')');
    }, 1200);
  };

  if (loading && items.length === 0) {
    return <Loader message="Fetching your shopping bag..." />;
  }

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Title */}
        <div className="mb-4">
          <span className="badge-pill-pink mb-2 d-inline-block">Bag & Checkout</span>
          <h1 className="mb-1">Your Shopping Cart</h1>
          <p className="text-muted small">
            {totalItems > 0
              ? `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your skincare bag.`
              : 'Your skincare bag is currently empty.'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glow-card p-5 text-center my-4 bg-white">
            <div className="fs-1 mb-3">🛍️</div>
            <h4 className="fw-bold mb-2">Your cart is feeling light!</h4>
            <p className="text-muted small mb-4">
              Explore our best-selling serums, hydrating cleansers, and sunscreens tailored for your skin type.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/products" className="btn btn-glow px-4">
                Explore Products
              </Link>
              <Link to="/skin-analysis" className="btn btn-glow-outline px-4">
                Take Skin Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Items Column */}
            <div className="col-lg-8">
              {/* Free shipping banner */}
              <div className="p-3 rounded-4 mb-3 border" style={{ backgroundColor: '#FFF0F5', borderColor: '#F8BBD0' }}>
                <div className="d-flex justify-content-between align-items-center mb-1 small fw-semibold">
                  <span style={{ color: '#C2185B' }}>
                    {remainingForFree === 0
                      ? '✨ Congratulations! You unlocked FREE Standard Shipping!'
                      : `Add ₹${remainingForFree.toFixed(0)} more to qualify for FREE Shipping.`}
                  </span>
                  <span className="text-muted">{progressToFreeShipping}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '6px' }}>
                  <div
                    className="progress-bar rounded-pill"
                    role="progressbar"
                    style={{ width: `${progressToFreeShipping}%`, backgroundColor: '#E91E63' }}
                  ></div>
                </div>
              </div>

              {/* Items Card */}
              <div className="glow-card p-3 p-md-4 bg-white shadow-sm">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th style={{ width: '45%' }}>Product</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          {/* Product info */}
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="rounded-3 object-fit-cover flex-shrink-0"
                                style={{ width: '64px', height: '64px' }}
                              />
                              <div>
                                <h6 className="mb-0 fw-bold small text-dark">{item.product.name}</h6>
                                <span className="text-muted small d-block">{item.product.category}</span>
                              </div>
                            </div>
                          </td>

                          {/* Unit price */}
                          <td className="text-center fw-semibold text-dark">
                            ₹{item.product.price}
                          </td>

                          {/* Stepper */}
                          <td className="text-center">
                            <div className="d-inline-flex align-items-center gap-2 bg-light px-2 py-1 rounded-pill border">
                              <button
                                type="button"
                                className="cart-qty-btn"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                title="Decrease"
                              >
                                -
                              </button>
                              <span className="fw-bold small px-1">{item.quantity}</span>
                              <button
                                type="button"
                                className="cart-qty-btn"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                title="Increase"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Line total */}
                          <td className="text-end fw-bold text-dark fs-6" style={{ color: '#E91E63' }}>
                            ₹{item.lineTotal.toFixed(2)}
                          </td>

                          {/* Delete */}
                          <td className="text-end">
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="btn btn-sm btn-link text-danger p-0"
                              title="Remove item"
                            >
                              <i className="bi bi-trash3 fs-6"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
                  <Link to="/products" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                    <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                  </Link>
                  <button onClick={clearCart} className="btn btn-link text-muted btn-sm text-decoration-none">
                    Clear Entire Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="col-lg-4">
              <div className="glow-card p-4 bg-white shadow-sm sticky-top" style={{ top: '100px' }}>
                <h5 className="fw-bold mb-3 font-heading">Order Summary</h5>

                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Bag Subtotal</span>
                  <span className="text-dark fw-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Estimated Shipping</span>
                  <span className="text-dark fw-semibold">
                    {shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="d-flex justify-content-between small text-muted mb-3">
                  <span>Taxes (GST 18% included)</span>
                  <span className="text-dark fw-semibold">₹{(subtotal * 0.18).toFixed(2)}</span>
                </div>

                <div className="border-top pt-3 mb-4 d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-6">Estimated Total</span>
                  <span className="fw-bold fs-4" style={{ color: '#E91E63' }}>
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Promo Code Mock */}
                <div className="input-group mb-4">
                  <input
                    type="text"
                    className="form-control rounded-start-pill small"
                    placeholder="Promo code (e.g. GLOW10)"
                  />
                  <button className="btn btn-dark rounded-end-pill small px-3" type="button" onClick={() => toast.info('Promo code GLOW10 applied in simulation!')}>
                    Apply
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(true)}
                  className="btn btn-glow w-100 py-3 fs-6"
                >
                  Proceed to Checkout <i className="bi bi-lock-fill ms-1"></i>
                </button>

                <div className="mt-3 text-center text-muted small" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Safe 256-bit Encrypted Simulated Checkout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Checkout Modal */}
        {checkoutModalOpen && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">Confirm Demonstration Order</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setCheckoutModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body py-4">
                  <p className="text-muted small mb-3">
                    As specified in the PRD, real financial payment gateways are excluded to keep the project lightweight and simple.
                  </p>
                  <div className="p-3 rounded-3 bg-light mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Total Items:</span>
                      <strong>{totalItems}</strong>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span>Grand Total:</span>
                      <strong className="text-danger fs-6">₹{grandTotal.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Delivery Address:</label>
                    <input
                      type="text"
                      className="form-control rounded-pill small"
                      defaultValue="Flat 402, Radiant Heights, Bandra West, Mumbai, MH - 400050"
                    />
                  </div>
                  <div className="form-check small">
                    <input className="form-check-input" type="checkbox" defaultChecked id="codCheck" />
                    <label className="form-check-label" htmlFor="codCheck">
                      Cash on Delivery (Pay on arrival)
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-3"
                    onClick={() => setCheckoutModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={ordering}
                    onClick={handleSimulateCheckout}
                    className="btn btn-glow rounded-pill px-4"
                  >
                    {ordering ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span> Processing...
                      </>
                    ) : (
                      'Confirm & Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
