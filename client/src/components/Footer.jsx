import { Link } from "react-router-dom";
import logo from "../assets/Future Basket Logo.png";
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
  "Accessories",
  "Mobile Accessories",
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/login" },
  { label: "Returns & Refunds", to: "/login" },
  { label: "Shipping Info", to: "/login" },
  { label: "Track Order", to: "/cart" },
  { label: "Contact Us", to: "/login" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-inner footer-grid">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-brand">
              <img
                src={logo}
                className="footer-brand-logo"
                alt="Future Basket Logo"
              />
              <div className="footer-brand-text-group">
                <span className="footer-brand-name">Future Basket</span>
                <span className="footer-brand-tagline">Whenever, Wherever</span>
              </div>
            </Link>
            <p className="footer-about">
              Future Basket — quality products, thoughtfully curated for what's next. 
              Enjoy fast shipping, secure checkouts, and 24/7 dedicated support.
            </p>
            <div className="footer-contact-info">
              <h4>Contact Us</h4>
              <p className="contact-item">📧 support@futurebasket.com</p>
              <p className="contact-item">📞 +1 (800) 555-0199</p>
              <p className="contact-item">📍 100 Future Way, Suite 500, NY</p>
            </div>
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
            &copy; {new Date().getFullYear()} Future Basket. All rights reserved.
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
