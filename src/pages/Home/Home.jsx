import "./Home.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cartService";
import { FaCartArrowDown } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert("Product added to cart");
  };

  const handleBuyNow = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to buy products");
        navigate("/login", {state: { from: `/checkout/${productId}` } });
        return;
      }
      navigate(`/checkout/${productId}`);
    } catch (error) {
      console.log(error);
      alert("Failed to proceed to checkout");
    }
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Products</h1>
      <div className="top-buttons">
        <button onClick={() => navigate("/cart")}>View Cart</button>
        {!token ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <>
            <button onClick={() => navigate("/order")}>My Orders</button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
            </div>

            <div className="product-content">
              <div className="product-title">{product.title}</div>
              <div className="prouct-bottom">
                <div className="product-price">${product.price}</div>
                <div
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <FaCartArrowDown />
                </div>
              </div>
              <button
                className="buy-now-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(product._id);
                }}
              >
                Buy Now
              </button>
              <button
                className="view-btn"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                view
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
