import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImage from "../assets/hero.png";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  const handleClear = () => {
    const ok = window.confirm("Are you sure you want to clear your cart?");
    if (ok) clearCart();
  };

  if (!cartItems.length) {
    return (
      <div className="cart-page">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-sub">
            Looks like you haven't added anything to your cart yet. Let's find some great deals!
          </p>
          <button className="cart-btn btn-primary-action" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Shopping Cart</h1>
      
      <div className="cart-grid">
        <section className="cart-items-section">
          <div className="cart-header-row">
            <span className="cart-items-count">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </span>
            <button className="cart-clear-btn" onClick={handleClear}>
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-row">
                <div className="cart-item-image-col">
                  <img
                    src={item.product?.image}
                    alt={item.product?.title || "Product"}
                    className="cart-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>

                <div className="cart-item-details-col">
                  <h3 className="cart-item-title">{item.product?.title || "(Untitled)"}</h3>
                  <div className="cart-item-category">{item.product?.category}</div>
                  <div className="cart-item-price">${Number(item.product?.price ?? 0).toFixed(2)}</div>
                  
                  <div className="qty-selector">
                    <button 
                      className="qty-adjust-btn" 
                      onClick={() => decreaseQuantity(item.productId)} 
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty-adjust-value">{item.quantity}</span>
                    <button 
                      className="qty-adjust-btn" 
                      onClick={() => increaseQuantity(item.productId)} 
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions-col">
                  <div className="cart-item-total-price">
                    ${(Number(item.product?.price ?? 0) * item.quantity).toFixed(2)}
                  </div>
                  <button className="cart-item-remove-btn" onClick={() => removeFromCart(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-summary-section">
          <h2 className="summary-section-title">Order Summary</h2>

          <div className="summary-details-box">
            <div className="summary-detail-row">
              <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              <span className="bold-price">${Number(totalPrice).toFixed(2)}</span>
            </div>
            <div className="summary-detail-row">
              <span>Shipping</span>
              <span className="shipping-badge">Calculated at next step</span>
            </div>
            
            <div className="summary-divider" />
            
            <div className="summary-detail-row total-row">
              <span>Total Price</span>
              <span className="grand-total">${Number(totalPrice).toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-actions">
            <button className="cart-btn btn-primary-action" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <button className="cart-btn btn-secondary-action" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>

          <div className="cart-trust-badges">
            <div className="trust-badge-item">
              <span className="badge-icon">🔒</span>
              <span>Secure SSL encrypted connection</span>
            </div>
            <div className="trust-badge-item">
              <span className="badge-icon">📦</span>
              <span>Fast packing & nationwide delivery</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
