import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, title, price, image, category } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

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
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600?text=Product";
              }}
            />
          </div>
          <span className="product-category-badge">{category}</span>
        </div>
      </Link>

      <div className="product-content">
        <Link to={`/product/${_id}`} className="product-title-link">
          <h3 className="product-title">{title}</h3>
        </Link>

        <div className="product-price-row">
          <span className="product-price">${Number(price).toFixed(2)}</span>
          <span className="product-price-note">Free delivery</span>
        </div>

        <div className="product-actions">
          <Link to={`/product/${_id}`} className="view-details-btn">
            View Details
          </Link>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
