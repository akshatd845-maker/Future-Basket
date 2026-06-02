import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
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
    const ok = window.confirm("Clear cart?");
    if (ok) clearCart();
  };

  if (!cartItems.length) {
    return (
      <div className="cart-page">
        <div className="empty-cart cart-items-card">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-sub">Add items to see them here.</div>
          <div style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-grid">
        <section className="cart-items-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 1000 }}>Shopping Cart</h2>
              <p style={{ margin: "6px 0 0", color: "#374151", fontWeight: 800 }}>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <button className="btn btn-ghost" onClick={handleClear}>Clear Cart</button>
          </div>

          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.product?.image}
                alt={item.product?.title || "Product"}
                className="cart-thumb"
              />

              <div>
                <div className="cart-title">{item.product?.title || "(Untitled)"}</div>
                <div className="cart-meta">${Number(item.product?.price ?? 0).toFixed(2)}</div>

                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => decreaseQuantity(item.productId)} aria-label="Decrease quantity">
                    -
                  </button>
                  <div className="qty-value">{item.quantity}</div>
                  <button className="qty-btn" onClick={() => increaseQuantity(item.productId)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>
                  ${Number(item.product?.price ?? 0).toFixed(2) * item.quantity}
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary-card">
          <div className="summary-title">Cart Summary</div>

          <div className="summary-row">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Total Price</span>
            <span className="summary-total">${Number(totalPrice).toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Continue Shopping</button>
            <button className="btn btn-ghost" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>

          <p style={{ marginTop: 14, color: "#374151", fontWeight: 800, fontSize: 13 }}>
            Taxes and shipping calculated at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;

