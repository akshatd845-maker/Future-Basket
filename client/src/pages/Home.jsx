import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productApi } from "../services/api";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import "../components/ProductCard.css";
import "./Home.css";

const CATEGORY_ICONS = {
  Electronics: "📱",
  Fashion: "👗",
  "Home & Kitchen": "🏠",
  Sports: "⚽",
  Books: "📚",
  Beauty: "💄",
  Accessories: "🎒",
  "Mobile Accessories": "🔌",
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryFilter = searchParams.get("category") || "";
  const section = searchParams.get("section") || "";

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productApi.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch products";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial data load on page mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      );
    }

    return result;
  }, [products, categoryFilter, searchQuery]);

  const featuredProducts = useMemo(() => {
    const list = filteredProducts.length ? filteredProducts : products;
    return list.slice(0, 4);
  }, [filteredProducts, products]);

  const latestProducts = useMemo(() => {
    const list = filteredProducts.length ? filteredProducts : products;
    return [...list]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 8);
  }, [filteredProducts, products]);

  const dealProducts = useMemo(() => {
    const list = filteredProducts.length ? filteredProducts : products;
    return list.filter((p) => Number(p.price) < 100).slice(0, 4);
  }, [filteredProducts, products]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return unique.slice(0, 8);
  }, [products]);

  const displayProducts = useMemo(() => {
    if (section === "featured") return featuredProducts;
    if (section === "latest") return latestProducts;
    if (section === "deals") return dealProducts.length ? dealProducts : featuredProducts;
    return filteredProducts;
  }, [
    section,
    featuredProducts,
    latestProducts,
    dealProducts,
    filteredProducts,
  ]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setNewsletterEmail("");
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <Hero />
        <div className="home-container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <Hero />
        <div className="home-container">
          <div className="error-container">
            <span className="error-icon" aria-hidden="true">
              ⚠️
            </span>
            <p className="error-message">{error}</p>
            <button type="button" className="retry-btn" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <Hero />

      <main className="home-container">
        {(searchQuery || categoryFilter) && (
          <div className="filter-banner">
            <p>
              {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""}
              {searchQuery && (
                <>
                  {" "}
                  for &ldquo;<strong>{searchParams.get("q")}</strong>&rdquo;
                </>
              )}
              {categoryFilter && (
                <>
                  {" "}
                  in <strong>{categoryFilter}</strong>
                </>
              )}
            </p>
            <Link to="/" className="clear-filters">
              Clear filters
            </Link>
          </div>
        )}

        {section && displayProducts.length > 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">
                {section === "featured" && "Best Sellers"}
                {section === "latest" && "New Releases"}
                {section === "deals" && "Today's Deals"}
              </h2>
            </div>
            <div className="products-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {!section && products.length === 0 && (
          <section className="home-section">
            <div className="empty-container">
              <span className="empty-icon" aria-hidden="true">
                📦
              </span>
              <p className="empty-message">No products found.</p>
            </div>
          </section>
        )}

        {!section && products.length > 0 && (
          <>
            {featuredProducts.length > 0 && (
              <section className="home-section" id="featured">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">Top Picks</span>
                    <h2 className="section-title">Featured Products</h2>
                  </div>
                  <Link to="/?section=featured" className="section-link">
                    See all →
                  </Link>
                </div>
                <div className="products-grid">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {latestProducts.length > 0 && (
              <section className="home-section" id="latest">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">Just In</span>
                    <h2 className="section-title">Latest Products</h2>
                  </div>
                  <Link to="/?section=latest" className="section-link">
                    See all →
                  </Link>
                </div>
                <div className="products-grid">
                  {latestProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {categories.length > 0 && (
              <section className="home-section categories-section" id="categories">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">Browse</span>
                    <h2 className="section-title">Shop by Category</h2>
                  </div>
                </div>
                <div className="categories-grid">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/?category=${encodeURIComponent(cat)}`}
                      className="category-card"
                    >
                      <span className="category-icon">
                        {CATEGORY_ICONS[cat] || "🛍️"}
                      </span>
                      <span className="category-name">{cat}</span>
                      <span className="category-count">
                        {
                          products.filter((p) => p.category === cat).length
                        }{" "}
                        items
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {filteredProducts.length > 0 &&
              searchQuery &&
              !section && (
                <section className="home-section">
                  <div className="section-header">
                    <h2 className="section-title">Search Results</h2>
                  </div>
                  <div className="products-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </section>
              )}

            {filteredProducts.length === 0 && (searchQuery || categoryFilter) && (
              <section className="home-section">
                <div className="empty-container">
                  <p className="empty-message">
                    No products match your search. Try different keywords.
                  </p>
                  <Link to="/" className="retry-btn">
                    View All Products
                  </Link>
                </div>
              </section>
            )}
          </>
        )}

        <section className="home-newsletter" aria-labelledby="newsletter-heading">
          <div className="home-newsletter-inner">
            <div className="home-newsletter-content">
              <span className="section-eyebrow light">Stay Updated</span>
              <h2 id="newsletter-heading">Join Future Basket Updates</h2>

              <p>
                Discover premium products, exclusive deals, and member-only offers.
                Whenever, Wherever.
              </p>
            </div>

            <form className="home-newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                aria-label="Newsletter email"
              />
              <button type="submit">Get Deals</button>
            </form>
            {newsletterSent && (
              <p className="home-newsletter-success" role="status">
                You&apos;re subscribed! Check your inbox for deals.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
