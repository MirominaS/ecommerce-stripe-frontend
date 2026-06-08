import "./Home.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cartService";
import { FaCartArrowDown } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "../../utils/toast";
import Footer from "../../components/Footer/Footer";
import { getSetting } from "../../services/adminService";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    heroText: "Discover Amazing Products",
    heroSubText: "New Collection 2026",
  });

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSetting();

        setSettings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
  }, []);

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      showWarning("Product is out of stock");
      return;
    }

    addToCart(product);

    showInfo("Product added to cart");
  };

  const handleBuyNow = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showWarning("Please login to buy products");

        navigate("/login", {
          state: {
            from: `/checkout/${productId}`,
          },
        });

        return;
      }

      navigate(`/checkout/${productId}`);
    } catch (error) {
      console.log(error);

      showError("Failed to proceed to checkout");
    }
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* HERO SECTION */}

        <div className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">{settings.heroSubText}</span>

            <h1>{settings.heroText}</h1>

            <p>
              Shop premium quality products at affordable prices with fast
              delivery.
            </p>

            <button
              className="hero-btn"
              onClick={() =>
                document.querySelector(".products-grid")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onView={(id) => navigate(`/products/${id}`)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
