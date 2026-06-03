import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/orders/my");
        if (res.data?.success) {
          setOrders(res.data.data || []);
        } else {
          setError(res.data?.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getStatusClass = (status) => {
    const s = status || "Pending";
    switch (s) {
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

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-card orders-error">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p className="orders-tagline">View and track your previous purchases.</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty-card">
            <div className="orders-empty-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet. Once you place an order, it will appear here.</p>
            <Link className="btn btn-primary orders-shop-btn" to="/">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-row">
                <div className="order-row-main">
                  <div className="order-title">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                  <div className="order-id-full">ID: {order._id}</div>
                  <div className="order-sub">
                    📅 {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                  </div>
                </div>
                
                <div className="order-meta">
                  <div className="order-meta-item">
                    <div className="order-meta-label">Total Price</div>
                    <div className="order-meta-value">${Number(order.totalPrice ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="order-meta-item">
                    <div className="order-meta-label">Payment</div>
                    <div className="order-meta-value" style={{ textTransform: "uppercase", fontSize: "0.82rem" }}>
                      {order.paymentMethod === "cod" ? "COD" : "Razorpay"}
                    </div>
                  </div>
                  <div className="order-meta-item">
                    <div className="order-meta-label">Status</div>
                    <div className="order-meta-value">
                      <span className={getStatusClass(order.orderStatus)}>
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <Link className="orders-details-btn" to={`/orders/${order._id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
