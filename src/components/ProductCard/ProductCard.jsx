import "./ProductCard.css";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({
  product,
  onAddToCart,
  onBuyNow,
  onView,
  onWishlist,
}) => {
  return (
    <div className="product-card" onClick={() => onView(product._id)}>
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-image"
        />
      </div>

      <div className="product-card-content">
        <p className="product-card-category">{product.category}</p>

        <h3 className="product-card-title">{product.title}</h3>

        <div className="product-card-price">${product.price}</div>

        {/* Stock Information */}
        <div className="product-stock">
          {product.stock === 0 ? (
            <span className="out-stock">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span className="low-stock">Only {product.stock} left</span>
          ) : (
            <span className="in-stock">In Stock ({product.stock})</span>
          )}
        </div>

        <button
          className={`wishlist-btn ${product.isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist(product);
          }}
        >
          <FaHeart />
        </button>

        <div className="product-card-actions">
          <button
            className="add-cart-btn"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <button
            className="buy-now-btn"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product._id);
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
