import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Cart", to: "/cart" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

const FOOTER_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Sports",
  "Books",
  "Beauty",
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/login" },
  { label: "Returns & Refunds", to: "/login" },
  { label: "Shipping Info", to: "/login" },
  { label: "Track Order", to: "/cart" },
  { label: "Contact Us", to: "/login" },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-newsletter">
        <div className="footer-inner footer-newsletter-inner">
          <div className="newsletter-copy">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get exclusive deals, new arrivals, and shopping tips in your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email for newsletter"
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscribed && (
            <p className="newsletter-success" role="status">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-inner footer-grid">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-brand">
              <span className="footer-brand-icon">e</span>
              <span>eCommerce</span>
            </Link>
            <p className="footer-about">
              Your trusted online marketplace for quality products at great prices.
              Shop with confidence — fast shipping, secure checkout.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to={`/?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul>
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-inner footer-bottom-inner">
          <p>
            &copy; {new Date().getFullYear()} eCommerce Marketplace. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
