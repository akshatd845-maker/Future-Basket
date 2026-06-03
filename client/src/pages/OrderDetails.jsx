import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import fallbackImage from "../assets/hero.png";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/orders/${id}`);
        if (res.data?.success) {
          setOrder(res.data.data);
        } else {
          setError(res.data?.message || "Failed to fetch order details");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleBack = () => navigate("/orders");

  const canCancel =
    order?.orderStatus === "Pending" || order?.orderStatus === "Processing";

  const getStatusClass = (status) => {
    switch (status) {
      case "Cancelled":
        return "status-pill status-cancelled";
      case "Pending":
        return "status-pill status-pending";
      case "Processing":
        return "status-pill status-processing";
      case "Delivered":
        return "status-pill status-delivered";
      default:
        return "status-pill";
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.orderStatus) return;

    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      setCancelling(true);
      setToast(null);

      const res = await api.patch(`/orders/${id}/cancel`);
      if (res.data?.success) {
        setOrder(res.data.data);
        setToast({ type: "success", message: "Order has been cancelled successfully." });
      } else {
        setToast({ type: "error", message: res.data?.message || "Failed to cancel order" });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to cancel order",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="details-loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="order-details-container">
          <div className="details-card details-error-card">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button className="details-btn btn-ghost" onClick={handleBack}>
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="details-back-header">
          <button className="back-link-btn" onClick={handleBack}>
            ← Back to Orders
          </button>
          <div className="details-header-title-row">
            <h1>Order Details</h1>
            <span className="order-id-badge">ID: {order._id}</span>
          </div>
          <p className="order-date-label">
            Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
          </p>
        </div>

        {toast && (
          <div className={`details-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
            <span className="toast-icon">{toast.type === "success" ? "✓" : "⚠️"}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
        )}

        {/* Visual Progress Timeline */}
        <div className="timeline-section-card">
          {order.orderStatus === "Cancelled" ? (
            <div className="order-cancelled-banner">
              <span className="cancelled-banner-icon">🚫</span>
              <div className="cancelled-banner-text-wrap">
                <h3>This order was cancelled</h3>
                <p>We processed your cancellation request. If a payment was made, your refund is being processed.</p>
              </div>
            </div>
          ) : (
            <div className="order-timeline">
              <div className="timeline-step completed">
                <div className="timeline-badge">✓</div>
                <div className="timeline-label">Order Placed</div>
              </div>
              <div className={`timeline-connector ${order.orderStatus === "Processing" || order.orderStatus === "Delivered" ? "completed" : ""}`} />
              <div className={`timeline-step ${order.orderStatus === "Processing" || order.orderStatus === "Delivered" ? "completed" : ""}`}>
                <div className="timeline-badge">✓</div>
                <div className="timeline-label">Processing</div>
              </div>
              <div className={`timeline-connector ${order.orderStatus === "Delivered" ? "completed" : ""}`} />
              <div className={`timeline-step ${order.orderStatus === "Delivered" ? "completed" : ""}`}>
                <div className="timeline-badge">✓</div>
                <div className="timeline-label">Delivered</div>
              </div>
            </div>
          )}
        </div>

        <div className="details-grid">
          <section className="details-card shipping-details-section">
            <h2 className="section-title">Shipping & Status</h2>
            
            <div className="shipping-info-box">
              <div className="kv-row">
                <span className="k">Full Name</span>
                <span className="v">{order.shippingAddress?.fullName}</span>
              </div>
              <div className="kv-row">
                <span className="k">Phone</span>
                <span className="v">{order.shippingAddress?.phone}</span>
              </div>
              <div className="kv-row">
                <span className="k">Street Address</span>
                <span className="v">{order.shippingAddress?.address}</span>
              </div>
              <div className="kv-row">
                <span className="k">City / State</span>
                <span className="v">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
              </div>
              <div className="kv-row">
                <span className="k">Postal Code</span>
                <span className="v">{order.shippingAddress?.postalCode}</span>
              </div>
              <div className="kv-row">
                <span className="k">Country</span>
                <span className="v">{order.shippingAddress?.country}</span>
              </div>
            </div>

            <div className="status-info-box">
              <div className="status-label-row">
                <span className="box-section-title">Order Status</span>
                <span className={getStatusClass(order.orderStatus)}>{order.orderStatus || "Pending"}</span>
              </div>
              
              <div className="payment-status-text">
                💳 Payment Method: <strong style={{ textTransform: "uppercase" }}>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}</strong>
              </div>
              
              <div className="payment-status-text" style={{ marginTop: 8 }}>
                💵 Payment Status: <strong>{order.isPaid
                  ? `Paid at ${order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ""}`
                  : "Pending"}</strong>
              </div>

              {canCancel && (
                <button
                  className="details-btn btn-danger-action"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling Order..." : "Cancel Order"}
                </button>
              )}
            </div>
          </section>

          <aside className="details-card items-summary-section">
            <h2 className="section-title">Ordered Items</h2>
            <div className="items-list">
              {order.orderItems?.map((item) => (
                <div key={`${item.product}-${item.name}`} className="order-item-row">
                  <img 
                    className="oi-thumb" 
                    src={item.image} 
                    alt={item.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="oi-meta">
                    <div className="oi-title">{item.name}</div>
                    <div className="oi-pricing">
                      ${Number(item.price ?? 0).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="oi-total">
                    ${(Number(item.price ?? 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="details-billing-box">
              <div className="kv-row">
                <span className="k">Subtotal</span>
                <span className="v">${Number(order.itemsPrice ?? 0).toFixed(2)}</span>
              </div>
              <div className="kv-row">
                <span className="k">Shipping Fee</span>
                <span className="v">${Number(order.shippingPrice ?? 0).toFixed(2)}</span>
              </div>
              <div className="kv-row">
                <span className="k">Tax (18%)</span>
                <span className="v">${Number(order.taxPrice ?? 0).toFixed(2)}</span>
              </div>
              
              <div className="kv-divider" />
              
              <div className="kv-row total-row">
                <span className="k">Grand Total</span>
                <span className="v">${Number(order.totalPrice ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
