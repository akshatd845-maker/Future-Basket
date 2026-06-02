import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../services/api";
import { useCart } from "../context/CartContext";
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
    // Defensive: product schema currently does not include stock.
    // Requirement: display "In Stock" by default when stock info is unavailable.
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
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
        <p style={{ fontWeight: 700, color: "#111827" }}>{error}</p>
        <button className="btn btn-ghost" onClick={() => navigate("/")}>Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-state">
        <p style={{ fontWeight: 800, fontSize: 18 }}>Product not found</p>
        <button className="btn btn-ghost" onClick={() => navigate("/")}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details-grid">
        <div className="product-image-card">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <span className="product-category">{product.category || "Uncategorized"}</span>

          <h1 className="product-title">{product.title}</h1>
          <div className="product-price">${Number(product.price).toFixed(2)}</div>

          <div className="stock-status">
            <span className="stock-dot" />
            <span className="stock-text">{stockAvailable ? "In Stock" : "Out of Stock"}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <button
              className="btn btn-primary"
              onClick={onAddToCart}
              disabled={!stockAvailable}
              style={!stockAvailable ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
            >
              <span>🛒</span>
              <span>Add To Cart</span>
            </button>

            <button className="btn btn-ghost" onClick={() => navigate("/")}>Back to Products</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

