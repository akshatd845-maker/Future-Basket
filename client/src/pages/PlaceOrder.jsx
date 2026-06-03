import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import fallbackImage from "../assets/hero.png";
import "./PlaceOrder.css";

// Helper to dynamically load the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

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
      // 1. Submit order details to our database first
      const res = await api.post("/orders", {
        orderItems: orderItemsPayload,
        shippingAddress,
        paymentMethod,
      });

      if (!res.data?.success) {
        setError(res.data?.message || "Failed to place order");
        setSubmitting(false);
        return;
      }

      const order = res.data.data;

      // 2. COD flow
      if (paymentMethod === "cod") {
        clearCart();
        navigate("/orders");
        return;
      }

      // 3. Razorpay payment gateway integration flow
      if (paymentMethod === "razorpay") {
        // Load external Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Failed to load Razorpay Payment Gateway. Please check your connection.");
          setSubmitting(false);
          return;
        }

        // Call backend API to create a Razorpay transaction order
        const orderRes = await api.post("/payment/create-order", {
          orderId: order._id,
        });

        if (!orderRes.data?.success) {
          setError(orderRes.data?.message || "Failed to initialize transaction");
          setSubmitting(false);
          return;
        }

        const { keyId, razorpayOrder } = orderRes.data;

        // Configure options for the Razorpay Checkout checkout overlay
        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Future Basket",
          description: `Payment for Order #${order._id.substring(order._id.length - 8).toUpperCase()}`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              setSubmitting(true);
              // Submit verification credentials back to our server
              const verifyRes = await api.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              });

              if (verifyRes.data?.success) {
                clearCart();
                // Redirect user directly to the paid order's details page
                navigate(`/orders/${order._id}`);
              } else {
                setError(verifyRes.data?.message || "Payment signature verification failed");
              }
            } catch (err) {
              setError(err.response?.data?.message || "Payment verification failed");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: shippingAddress.phone || "",
          },
          theme: {
            color: "#2563eb", // Matches accent blue action colour
          },
          modal: {
            ondismiss: () => {
              setError("Payment checkout closed. You can pay from your Orders page.");
              setSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      setSubmitting(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="place-order-page">
        <div className="place-order-empty-card">
          <div className="place-order-empty-icon">🛒</div>
          <h2>Review Order</h2>
          <p>Your cart is empty.</p>
          <button className="place-order-btn btn-primary" onClick={() => navigate("/cart")}>
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <div className="place-order-container">
        <div className="place-order-header">
          <h1>Review & Confirm Order</h1>
          <p className="place-order-tagline">Please double-check your shipping details and payment choice.</p>
        </div>

        <div className="place-order-grid">
          <section className="place-order-items-card">
            <h2 className="section-title">Review Items ({cartItems.length})</h2>
            <div className="items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="place-order-item">
                  <img
                    src={item.product?.image}
                    alt={item.product?.title || "Product"}
                    className="place-order-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
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

            <h2 className="section-title" style={{ marginTop: 32 }}>Shipping Address</h2>
            <div className="shipping-box">
              {shippingAddress ? (
                <>
                  <div className="shipping-name">{shippingAddress.fullName}</div>
                  <div className="shipping-phone">📞 {shippingAddress.phone}</div>
                  <div className="shipping-addr">
                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </div>
                </>
              ) : (
                <div className="error-text">⚠️ Missing shipping address details. Please go back to checkout.</div>
              )}
            </div>

            <h2 className="section-title" style={{ marginTop: 32 }}>Payment Method</h2>
            <div className="payment-methods">
              <label className={`radio-label ${paymentMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">💵</span>
                  <div>
                    <span className="payment-title">Cash on Delivery (COD)</span>
                    <span className="payment-desc">Pay with cash when your shipment is delivered.</span>
                  </div>
                </div>
              </label>

              <label className={`radio-label ${paymentMethod === "razorpay" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <div>
                    <span className="payment-title">Pay Online (Razorpay)</span>
                    <span className="payment-desc">Pay instantly using Credit/Debit Cards, UPI, Netbanking, or Wallets.</span>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <aside className="place-order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-detail-list">
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
              
              <div className="summary-divider" />
              
              <div className="summary-row total-row">
                <span className="summary-total-label">Grand Total</span>
                <span className="grand-total">${computed.total.toFixed(2)}</span>
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="summary-actions">
              <button
                className="place-order-btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
              </button>

              <button
                className="place-order-btn btn-ghost"
                onClick={() => navigate("/checkout", { state: { shippingAddress } })}
                disabled={submitting}
              >
                Back to Shipping Form
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
