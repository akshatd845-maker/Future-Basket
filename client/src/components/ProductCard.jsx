import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImage from "../assets/hero.png";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, title, price, image, category, stock } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Determine stock text and badge class
  const stockInfo = (() => {
    if (stock === undefined || stock === null) {
      return { text: "In Stock", class: "stock-in" };
    }
    const qty = Number(stock);
    if (!Number.isFinite(qty) || qty > 5) {
      return { text: "In Stock", class: "stock-in" };
    }
    if (qty <= 0) {
      return { text: "Out of Stock", class: "stock-out" };
    }
    return { text: `Only ${qty} left`, class: "stock-low" };
  })();

  return (
    <article className="product-card">
      <Link to={`/product/${_id}`} className="product-image-link">
        <div className="product-image-container">
          <div className="product-image-wrapper">
            <img
              src={image}
              alt={title}
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
          <span className="product-category-badge">{category || "Product"}</span>
          <span className={`product-stock-badge ${stockInfo.class}`}>
            {stockInfo.text}
          </span>
        </div>
      </Link>

      <div className="product-content">
        <Link to={`/product/${_id}`} className="product-title-link">
          <h3 className="product-title" title={title}>{title}</h3>
        </Link>

        <div className="product-price-row">
          <span className="product-price">${Number(price).toFixed(2)}</span>
          <span className="product-price-note">✓ Free delivery</span>
        </div>

        <div className="product-actions">
          <Link to={`/product/${_id}`} className="view-details-btn">
            View Details
          </Link>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={stock !== undefined && stock !== null && Number(stock) <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
