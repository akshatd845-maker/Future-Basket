import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import logo from "../assets/Future Basket Logo.png";
import "./Navbar.css";


const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Electronics", label: "Electronics" },
  { id: "Fashion", label: "Fashion" },
  { id: "Home & Kitchen", label: "Home & Kitchen" },
  { id: "Sports", label: "Sports" },
  { id: "Books", label: "Books" },
  { id: "Beauty", label: "Beauty" },
  { id: "Accessories", label: "Accessories" },
  { id: "Mobile Accessories", label: "Mobile" },
];

const DRAWER_LINKS = [
  { label: "Categories", icon: "grid", href: "/", badge: null },
  { label: "My Orders", icon: "package", href: "/orders", badge: null },
  { label: "Wishlist", icon: "heart", href: "/wishlist", badge: null },
  { label: "Account", icon: "user", href: "/profile", badge: null },
  { label: "Settings", icon: "settings", href: "/settings", badge: null },
];

function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("all");

  const cartBadge = useMemo(() => totalItems, [totalItems]);

  const closeDrawer = () => setDrawerOpen(false);
  const closeSearch = () => setSearchOpen(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (drawerOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchQuery.trim();
    if (trimmed) params.set("q", trimmed);
    if (activeCategory && activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
    closeSearch();
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
  };

  const handleDrawerLinkClick = (href) => {
    navigate(href);
    closeDrawer();
  };

  return (
    <>
      {/* Sticky Header */}
      <header className={`premium-header ${scrolled ? "scrolled" : ""}`}>
        <div className="premium-header-inner">
          {/* Left: Logo + Brand */}
          <Link to="/" className="premium-brand" onClick={closeDrawer}>
            <img src={logo} className="premium-logo" alt="Future Basket" />
            <span className="premium-brand-name">Future Basket</span>
          </Link>

          {/* Right: Actions */}
          <div className="premium-actions">
            <button
              type="button"
              className="premium-action-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" strokeLinecap="round" />
              </svg>
            </button>

            <Link to="/cart" className="premium-action-btn premium-cart-btn" aria-label="Cart">
              <div className="premium-cart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M2 3h3l2.2 12.4a2 2 0 002 1.9h9.2a2 2 0 002-1.9L21 7H6" strokeLinejoin="round" />
                </svg>
                <AnimatePresence mode="wait">
                  {cartBadge > 0 && (
                    <motion.span
                      key={cartBadge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="premium-cart-badge"
                    >
                      {cartBadge > 99 ? "99+" : cartBadge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="premium-action-btn" aria-label="Profile">
                <div className="premium-user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="premium-action-btn" aria-label="Sign In">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </Link>
            )}

            <button
              type="button"
              className={`premium-hamburger ${drawerOpen ? "open" : ""}`}
              aria-label="Menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Full-width Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="premium-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="premium-search-container"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="premium-search-back"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" strokeLinecap="round" />
                  <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <form className="premium-search-form" onSubmit={handleSearch}>
                <div className="premium-search-input-wrap">
                  <svg className="premium-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" strokeLinecap="round" />
                  </svg>
                  <input
                    type="search"
                    className="premium-search-input"
                    placeholder="Search products, brands and categories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="premium-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
                <button type="submit" className="premium-search-submit">
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Chips */}
      <div className="premium-categories">
        <div className="premium-categories-inner">
          <motion.div className="premium-category-chips" drag="x" dragConstraints={{ left: 0, right: 0 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`premium-category-chip ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Drawer Menu */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="premium-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />
            <motion.div
              className="premium-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="premium-drawer-header">
                <div className="premium-drawer-user">
                  {isAuthenticated ? (
                    <>
                      <div className="premium-drawer-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="premium-drawer-user-info">
                        <span className="premium-drawer-greeting">Welcome back,</span>
                        <span className="premium-drawer-name">{user?.name || "User"}</span>
                      </div>
                    </>
                  ) : (
                    <div className="premium-drawer-guest">
                      <div className="premium-drawer-avatar premium-drawer-avatar-guest">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                      </div>
                      <span className="premium-drawer-greeting">Hello, Sign in</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="premium-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="premium-drawer-content">
                {!isAuthenticated && (
                  <div className="premium-drawer-auth">
                    <Link to="/login" className="premium-drawer-btn premium-drawer-btn-primary" onClick={closeDrawer}>
                      Sign In
                    </Link>
                    <Link to="/register" className="premium-drawer-btn premium-drawer-btn-secondary" onClick={closeDrawer}>
                      Register
                    </Link>
                  </div>
                )}

                <nav className="premium-drawer-nav">
                  {DRAWER_LINKS.map((link, index) => (
                    <motion.button
                      key={link.label}
                      type="button"
                      className="premium-drawer-link"
                      onClick={() => handleDrawerLinkClick(link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="premium-drawer-link-icon">
                        {link.icon === "grid" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                        )}
                        {link.icon === "package" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 8v13H3V8M1 3h22v5H1V3z" />
                            <path d="M10 12h4" />
                          </svg>
                        )}
                        {link.icon === "heart" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        )}
                        {link.icon === "user" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                          </svg>
                        )}
                        {link.icon === "settings" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        )}
                      </span>
                      <span className="premium-drawer-link-label">{link.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {isAuthenticated && (
                  <div className="premium-drawer-footer">
                    <button
                      type="button"
                      className="premium-drawer-logout"
                      onClick={() => {
                        logout();
                        closeDrawer();
                        navigate("/");
                      }}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;