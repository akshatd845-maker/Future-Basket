import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../services/api";
import { useCart } from "../context/CartContext";
import fallbackImage from "../assets/hero.png";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await productApi.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch product";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const stockAvailable = (() => {
    const stock = product?.stock;
    if (stock === undefined || stock === null) return true;

    const n = Number(stock);
    if (!Number.isFinite(n)) return true;
    return n > 0;
  })();

  const onAddToCart = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p className="loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-page">
        <div className="error-state">
          <div className="error-icon" aria-hidden="true">⚠️</div>
          <p className="error-message">{error}</p>
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="not-found-state">
          <div className="error-icon" aria-hidden="true">📦</div>
          <p className="not-found-message">Product not found</p>
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-grid">
          <div className="product-image-card">
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          </div>

          <div className="product-info">
            <div className="product-meta-row">
              <span className="product-category">{product.category || "General"}</span>
              <div className={`stock-status ${stockAvailable ? "in-stock" : "out-of-stock"}`}>
                <span className="stock-dot" />
                <span className="stock-text">{stockAvailable ? "In Stock" : "Out of Stock"}</span>
              </div>
            </div>

            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">${Number(product.price).toFixed(2)}</div>

            <div className="product-divider" />

            <p className="product-description">{product.description}</p>

            <div className="product-highlights">
              <h3>Product Guarantees</h3>
              <ul>
                <li>
                  <span className="highlight-icon">🔒</span>
                  <span><strong>Secure Checkout:</strong> SSL-encrypted safe payments</span>
                </li>
                <li>
                  <span className="highlight-icon">🚚</span>
                  <span><strong>Free Express Shipping:</strong> For all orders over $100.00</span>
                </li>
                <li>
                  <span className="highlight-icon">🛡️</span>
                  <span><strong>30-Day returns:</strong> Worry-free money-back assurance</span>
                </li>
              </ul>
            </div>

            <div className="product-actions">
              <button
                className="btn btn-primary add-to-cart-action-btn"
                onClick={onAddToCart}
                disabled={!stockAvailable}
              >
                <span>🛒</span>
                <span>Add To Cart</span>
              </button>

              <button className="btn btn-ghost" onClick={() => navigate("/")}>
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
