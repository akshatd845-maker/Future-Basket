import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../services/api";
import "./PlaceOrder.css";

function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, totalPrice } = useCart();

  const shippingAddress = location.state?.shippingAddress;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const computed = useMemo(() => {
    const itemsPrice = Number(totalPrice);
    const shippingPrice = itemsPrice >= 1000 ? 0 : 99;
    const taxPrice = itemsPrice * 0.18;
    const total = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, total };
  }, [totalPrice]);

  const orderItemsPayload = useMemo(() => {
    return (cartItems || []).map((i) => ({
      product: i.productId,
      name: i.product?.title,
      quantity: i.quantity,
      price: Number(i.product?.price ?? 0),
      image: i.product?.image,
    }));
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    setError(null);

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!shippingAddress) {
      setError("Missing shipping address. Go back to Checkout.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/orders", {
        orderItems: orderItemsPayload,
        shippingAddress,
        paymentMethod,
      });

      if (res.data?.success) {
        // Clear cart + localStorage cart
        clearCart();

        navigate("/orders");
      } else {
        setError(res.data?.message || "Failed to place order");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="place-order-page">
        <div className="place-order-card">
          <h2>Place Order</h2>
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <div className="place-order-grid">
        <section className="place-order-items-card">
          <div className="section-title">Review Items</div>

          <div className="items-list">
            {cartItems.map((item) => (
              <div key={item.productId} className="place-order-item">
                <img
                  src={item.product?.image}
                  alt={item.product?.title || "Product"}
                  className="place-order-thumb"
                />
                <div className="place-order-item-meta">
                  <div className="place-order-item-title">{item.product?.title || "(Untitled)"}</div>
                  <div className="place-order-item-sub">
                    ${Number(item.product?.price ?? 0).toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="place-order-item-total">
                  ${(Number(item.product?.price ?? 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Shipping Address</div>

          <div className="shipping-box">
            {shippingAddress ? (
              <>
                <div><b>{shippingAddress.fullName}</b></div>
                <div>{shippingAddress.phone}</div>
                <div>{shippingAddress.address}</div>
                <div>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </div>
                <div>{shippingAddress.country}</div>
              </>
            ) : (
              <div className="error-text">Missing address.</div>
            )}
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Payment Method</div>

          <div className="payment-methods">
            <label className="radio">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="radio">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Card (demo)</span>
            </label>
          </div>
        </section>

        <aside className="place-order-summary-card">
          <div className="summary-title">Order Summary</div>

          <div className="summary-row">
            <span>Items Total</span>
            <span>${computed.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${computed.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18%)</span>
            <span>${computed.taxPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-total-label">Total</span>
            <span className="summary-total">${computed.total.toFixed(2)}</span>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="summary-actions">
            <button
              className="btn btn-primary"
              onClick={handlePlaceOrder}
              disabled={submitting}
            >
              {submitting ? "Placing..." : "Place Order"}
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => navigate("/checkout", { state: { shippingAddress } })}
              disabled={submitting}
            >
              Back
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PlaceOrder;

