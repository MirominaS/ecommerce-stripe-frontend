import "./ProductCard.css";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({
  product,
  onAddToCart,
  onBuyNow,
  onView,
  onWishlist,
}) => {
  const displayVariant =
    product.hasVariants && product.variants?.length > 0
      ? product.variants[0]
      : null;

  return (
    <div className="product-card" onClick={() => onView(product._id)}>
      <div className="product-card-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-card-image"
        />
      </div>

      <div className="product-card-content">
        <p className="product-card-category">{product.category}</p>

        <h3 className="product-card-title">{product.title}</h3>

        <div className="product-card-price">
          €
          {product.hasVariants
            ? displayVariant?.sellingPrice
            : product.sellingPrice}
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
