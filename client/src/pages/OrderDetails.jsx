import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data?.success) {
          setOrder(res.data.data);
        } else {
          setError(res.data?.message || "Failed to fetch order" );
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleBack = () => navigate("/orders");

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-card">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="order-details-card order-details-error">{error}</div>
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={handleBack}>
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="orders-header">
          <h2>Order Details</h2>
        </div>

        <div className="details-grid">
          <section className="details-card">
            <div className="section-title">Shipping Details</div>
            <div className="kv">
              <div className="k">Full Name</div>
              <div className="v">{order.shippingAddress?.fullName}</div>
            </div>
            <div className="kv">
              <div className="k">Phone</div>
              <div className="v">{order.shippingAddress?.phone}</div>
            </div>
            <div className="kv">
              <div className="k">Address</div>
              <div className="v">{order.shippingAddress?.address}</div>
            </div>
            <div className="kv">
              <div className="k">City/State</div>
              <div className="v">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </div>
            </div>
            <div className="kv">
              <div className="k">Postal Code</div>
              <div className="v">{order.shippingAddress?.postalCode}</div>
            </div>
            <div className="kv">
              <div className="k">Country</div>
              <div className="v">{order.shippingAddress?.country}</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="section-title">Order Status</div>
              <div className="status-pill">{order.orderStatus}</div>
              <div className="status-sub">
                Payment: {order.isPaid ? `Paid${order.paidAt ? ` at ${new Date(order.paidAt).toLocaleString()}` : ""}` : "Pending"}
              </div>
            </div>
          </section>

          <aside className="details-card">
            <div className="section-title">Ordered Items</div>
            <div className="items-list">
              {order.orderItems?.map((item) => (
                <div key={`${item.product}-${item.name}`} className="order-item-row">
                  <img className="oi-thumb" src={item.image} alt={item.name} />
                  <div className="oi-meta">
                    <div className="oi-title">{item.name}</div>
                    <div className="oi-sub">Qty: {item.quantity}</div>
                    <div className="oi-sub">Price: ${Number(item.price ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="oi-total">${Number(item.price ?? 0) * item.quantity ? Number(item.price ?? 0) * item.quantity : 0}</div>
                </div>
              ))}
            </div>

            <div className="totals">
              <div className="kv">
                <div className="k">Items Price</div>
                <div className="v">${Number(order.itemsPrice ?? 0).toFixed(2)}</div>
              </div>
              <div className="kv">
                <div className="k">Shipping Price</div>
                <div className="v">${Number(order.shippingPrice ?? 0).toFixed(2)}</div>
              </div>
              <div className="kv">
                <div className="k">Tax Price</div>
                <div className="v">${Number(order.taxPrice ?? 0).toFixed(2)}</div>
              </div>
              <div className="kv total">
                <div className="k">Total</div>
                <div className="v">${Number(order.totalPrice ?? 0).toFixed(2)}</div>
              </div>
            </div>

            <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={handleBack}>
              Back to My Orders
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

