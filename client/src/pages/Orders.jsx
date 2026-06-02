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

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-card">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-card orders-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h2>My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="orders-card">
            <div style={{ fontWeight: 1000, marginBottom: 8 }}>No orders yet</div>
            <div style={{ color: "#374151", fontWeight: 800, fontSize: 13 }}>
              Place an order to see it here.
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-row">
                <div>
                  <div className="order-title">Order {order._id}</div>
                  <div className="order-sub">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                  </div>
                </div>
                <div className="order-meta">
                  <div className="order-meta-item">
                    <div className="order-meta-label">Total</div>
                    <div className="order-meta-value">${Number(order.totalPrice ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="order-meta-item">
                    <div className="order-meta-label">Status</div>
                    <div className="order-meta-value">{order.orderStatus || "Pending"}</div>
                  </div>
                </div>
                <div className="order-actions">
                  <Link className="btn btn-primary" to={`/orders/${order._id}`}>
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

