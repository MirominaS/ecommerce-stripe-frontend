import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, onBuyNow, onView }) => {
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

        <div className="product-card-actions">
          <button
            className="add-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            Add to Cart
          </button>

          <button
            className="buy-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product._id);
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
