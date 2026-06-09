import React from "react";
import "./ProductDetails.css";
import { addToCart } from "../../services/cartService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "../../utils/toast";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { addToWishlist } from "../../services/wishlistService";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        console.log(data);

        setProduct(data.product);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (product.stock === 0) {
        showWarning("Product is out of stock");
        return;
      }

      addToCart(product);

      showInfo("Product added to cart");
    } catch (error) {
      console.log(error);
      showError("Failed to add product to cart");
    }
  };

  const handleWishlist = () => {
    addToWishlist(product);

    showSuccess("Added to wishlist");
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  if (!product) {
    return <h1 className="not-found-text">Product not found</h1>;
  }

  return (
    <>
      <Navbar />
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-image-section">
            <div className="product-image-wrapper">
              <img
                className="product-image"
                src={product.image}
                alt={product.title}
              />
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.title}</h1>

            <p className="product-description">{product.description}</p>

            <h2 className="product-price">${product.price}</h2>

            <div className="product-stock">
              {product.stock === 0 ? (
                <span className="out-stock">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="low-stock">Only {product.stock} left</span>
              ) : (
                <span className="in-stock">In Stock ({product.stock})</span>
              )}
            </div>
            <div className="product-buttons">
              <button
                className="product-btn"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
              </button>
              <button className="wishlist-btn" onClick={handleWishlist}>
                Add To Wishlist
              </button>
              <button
                className="view-cart-btn"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
