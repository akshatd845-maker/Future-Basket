import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const computed = useMemo(() => {
    const itemsPrice = Number(totalPrice);
    const shippingPrice = itemsPrice >= 1000 ? 0 : 99;
    const taxPrice = itemsPrice * 0.18;
    const total = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, total };
  }, [totalPrice]);

  const validate = () => {
    const nextErrors = {};
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    requiredFields.forEach((key) => {
      if (!form[key] || String(form[key]).trim().length === 0) {
        nextErrors[key] = "Required";
      }
    });

    // Basic numeric validation for phone/postalCode
    if (form.phone && !String(form.phone).trim().match(/^[0-9+()\-\s]{6,}$/)) {
      nextErrors.phone = "Invalid phone";
    }

    if (form.postalCode && !String(form.postalCode).trim().match(/^[0-9A-Za-z\-\s]{3,10}$/)) {
      nextErrors.postalCode = "Invalid postal code";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!cartItems.length) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      navigate("/place-order", { state: { shippingAddress: form } });
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <h2>Checkout</h2>
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate("/cart")}>
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        <section className="checkout-form-card">
          <h2>Shipping Address</h2>

          <div className="form-grid">
            <label className="field">
              <span>Full Name</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.fullName && <div className="field-error">{errors.fullName}</div>}
            </label>

            <label className="field">
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone"
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </label>

            <label className="field field-full">
              <span>Address</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House no, street"
              />
              {errors.address && <div className="field-error">{errors.address}</div>}
            </label>

            <label className="field">
              <span>City</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && <div className="field-error">{errors.city}</div>}
            </label>

            <label className="field">
              <span>State</span>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
              {errors.state && <div className="field-error">{errors.state}</div>}
            </label>

            <label className="field">
              <span>Postal Code</span>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
              />
              {errors.postalCode && <div className="field-error">{errors.postalCode}</div>}
            </label>

            <label className="field field-full">
              <span>Country</span>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
              />
              {errors.country && <div className="field-error">{errors.country}</div>}
            </label>
          </div>

          <div className="checkout-actions">
            <button className="btn btn-primary" onClick={handleContinue} disabled={submitting}>
              Continue
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/cart")} disabled={submitting}>
              Back to Cart
            </button>
          </div>
        </section>

        <aside className="checkout-summary-card">
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
            <span>Total</span>
            <span className="summary-total">${computed.total.toFixed(2)}</span>
          </div>

          <p className="summary-note">You will confirm payment on the next step.</p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;

