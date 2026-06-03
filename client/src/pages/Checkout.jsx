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
        nextErrors[key] = "This field is required";
      }
    });

    if (form.phone && !String(form.phone).trim().match(/^[0-9+()\-\s]{6,}$/)) {
      nextErrors.phone = "Please enter a valid phone number";
    }

    if (form.postalCode && !String(form.postalCode).trim().match(/^[0-9A-Za-z\-\s]{3,10}$/)) {
      nextErrors.postalCode = "Please enter a valid postal code";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
        <div className="checkout-empty-card">
          <div className="checkout-empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>You cannot checkout with an empty cart. Please add some products first.</p>
          <button className="checkout-btn btn-primary" onClick={() => navigate("/cart")}>
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>
            <span className="secure-badge-icon">🔒</span> Secure Checkout
          </h1>
          <p className="checkout-tagline">Please fill out your shipping address details below.</p>
        </div>

        <div className="checkout-grid">
          <section className="checkout-form-card">
            <h2>Shipping Address</h2>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={errors.fullName ? "input-error" : ""}
                />
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}
              </div>

              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 555-0199"
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>

              <div className="field field-full">
                <label htmlFor="address">Street Address</label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 100 Main St, Apt 4B"
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && <div className="field-error">{errors.address}</div>}
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. New York"
                  className={errors.city ? "input-error" : ""}
                />
                {errors.city && <div className="field-error">{errors.city}</div>}
              </div>

              <div className="field">
                <label htmlFor="state">State / Province</label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. NY"
                  className={errors.state ? "input-error" : ""}
                />
                {errors.state && <div className="field-error">{errors.state}</div>}
              </div>

              <div className="field">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 10001"
                  className={errors.postalCode ? "input-error" : ""}
                />
                {errors.postalCode && <div className="field-error">{errors.postalCode}</div>}
              </div>

              <div className="field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. United States"
                  className={errors.country ? "input-error" : ""}
                />
                {errors.country && <div className="field-error">{errors.country}</div>}
              </div>
            </div>

            <div className="checkout-actions">
              <button className="checkout-btn btn-primary" onClick={handleContinue} disabled={submitting}>
                {submitting ? "Processing..." : "Continue to Payment"}
              </button>
              <button className="checkout-btn btn-ghost" onClick={() => navigate("/cart")} disabled={submitting}>
                Back to Cart
              </button>
            </div>
          </section>

          <aside className="checkout-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-detail-list">
              <div className="summary-row">
                <span>Items Total</span>
                <span>${computed.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping & Handling</span>
                <span>${computed.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (18%)</span>
                <span>${computed.taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider" />
              
              <div className="summary-row total-row">
                <span>Order Total</span>
                <span className="grand-total">${computed.total.toFixed(2)}</span>
              </div>
            </div>

            <p className="summary-note">🔒 SSL Encrypted Safe Checkout. You will confirm your payment details on the next screen.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
