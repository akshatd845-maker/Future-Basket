import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
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
  "Toys",
  "Grocery",
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
            <span className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4h10l1 3h3v2h-1l-2 11H6L4 9H3V7h3l1-3zm2 3h6l-.5-1.5h-5L9 7zm-1.2 4 1.5 7h7.4l1.5-7H7.8z" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">eCommerce</span>
              <span className="brand-tagline">Marketplace</span>
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
              className="mobile-toggle"
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
    </header>
  );
}

export default Navbar;
