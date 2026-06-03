import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import logo from "../assets/Future Basket Logo.png";
import "./Navbar.css";


const TOP_LINKS = [
  { label: "Best Sellers", href: "/?section=featured" },
  { label: "Gift Ideas", href: "/?category=Gifts" },
  { label: "New Releases", href: "/?section=latest" },
  { label: "Today's Deals", href: "/?section=deals" },
  { label: "Customer Service", href: "/login" },
];


const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Sports",
  "Books",
  "Beauty",
  "Accessories",
  "Mobile Accessories",
];

function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All Categories"
  );

  const cartBadge = useMemo(() => totalItems, [totalItems]);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchQuery.trim();
    if (trimmed) params.set("q", trimmed);
    if (category && category !== "All Categories") {
      params.set("category", category);
    }
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
    closeMobile();
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
    closeMobile();
  };

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="top-bar-inner">
          <nav className="top-bar-nav" aria-label="Promotional links">
            {TOP_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="top-bar-link"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="main-header">
        <div className="main-header-inner">
          <Link to="/" className="brand" onClick={closeMobile}>
            <img
              src={logo}
              className="brand-logo"
              alt="Future Basket Logo"
            />
            <span className="brand-text">
              <span className="brand-name">Future Basket</span>
              <span className="brand-tagline">Whenever, Wherever</span>
            </span>
          </Link>

          <div className={`search-area ${mobileOpen ? "open" : ""}`}>
            <label className="category-select-wrap">
              <span className="sr-only">Category</span>
              <select
                className="category-select"
                value={category}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="search"
                className="search-input"
                placeholder="Search products, brands and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="M20 20l-4-4" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="search-btn-text">Search</span>
              </button>
            </form>
          </div>

          <div className="header-actions">
            <Link
              to="/cart"
              className="header-action cart-action"
              onClick={closeMobile}
            >
              <span className="action-icon cart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="20" r="1.5" strokeWidth="2" />
                  <circle cx="18" cy="20" r="1.5" strokeWidth="2" />
                  <path
                    d="M2 3h3l2.2 12.4a2 2 0 002 1.9h9.2a2 2 0 002-1.9L21 7H6"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                {cartBadge > 0 && (
                  <span className="cart-badge" aria-label={`${cartBadge} items in cart`}>
                    {cartBadge > 99 ? "99+" : cartBadge}
                  </span>
                )}
              </span>
              <span className="action-label">
                <span className="action-title">Cart</span>
                <span className="action-sub">
                  {cartBadge} {cartBadge === 1 ? "item" : "items"}
                </span>
              </span>
            </Link>

            <div className="auth-actions">
              {isAuthenticated ? (
                <>
                  <div className="user-info">
                    <Link to="/orders" className="header-action" onClick={closeMobile}>
                      <span className="action-label">
                        <span className="action-title">Hello, {user?.name?.split(" ")[0] || "User"}</span>
                        <span className="action-sub">Account & Lists</span>
                      </span>
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={() => {
                      logout();
                      closeMobile();
                      navigate("/");
                    }}
                    disabled={loading}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="header-action" onClick={closeMobile}>
                    <span className="action-label">
                      <span className="action-title">Hello, Sign in</span>
                      <span className="action-sub">Account & Lists</span>
                    </span>
                  </Link>
                  <Link
                    to="/register"
                    className="register-btn"
                    onClick={closeMobile}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className={`mobile-toggle ${mobileOpen ? "open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && <div className="drawer-overlay" onClick={closeMobile} />}

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="drawer-header">
          <Link to="/" className="brand" onClick={closeMobile}>
            <img src={logo} className="brand-logo" alt="Future Basket Logo" />
            <span className="brand-text">
              <span className="brand-name">Future Basket</span>
            </span>
          </Link>
          <button type="button" className="drawer-close-btn" onClick={closeMobile} aria-label="Close menu">
            &times;
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-section auth-section">
            {isAuthenticated ? (
              <div className="drawer-user-info">
                <span className="drawer-greeting">Hello, {user?.name?.split(" ")[0] || "User"}</span>
                <div className="drawer-auth-buttons">
                  <Link to="/orders" className="drawer-btn btn-primary" onClick={closeMobile}>
                    My Orders
                  </Link>
                  <button
                    type="button"
                    className="drawer-btn btn-outline btn-logout"
                    onClick={() => {
                      logout();
                      closeMobile();
                      navigate("/");
                    }}
                    disabled={loading}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="drawer-user-info">
                <span className="drawer-greeting">Hello, Sign In</span>
                <div className="drawer-auth-buttons">
                  <Link to="/login" className="drawer-btn btn-primary" onClick={closeMobile}>
                    Sign In
                  </Link>
                  <Link to="/register" className="drawer-btn btn-outline" onClick={closeMobile}>
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <h4 className="drawer-section-title">Shop by Category</h4>
            <div className="drawer-categories-select-wrapper">
              <select
                className="drawer-category-select"
                value={category}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="drawer-divider" />

          <div className="drawer-section">
            <h4 className="drawer-section-title">Quick Links</h4>
            <nav className="drawer-nav" aria-label="Mobile promotional links">
              {TOP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="drawer-nav-link"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
