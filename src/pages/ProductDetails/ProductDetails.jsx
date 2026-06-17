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
import { addToWishlist, isInWishlist } from "../../services/wishlistService";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        setProduct(data.product);

        if (data.product.hasVariants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
        setWishlisted(isInWishlist(data.product._id));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("Selected Variant Changed:", selectedVariant);
  }, [selectedVariant]);

  const handleAddToCart = () => {
    try {
      if (currentStock === 0) {
        showWarning("Product is out of stock");
        return;
      }

      const cartItem = {
        _id: product._id,
        variantId: selectedVariant?._id || null,
        title: product.title,
        sku: selectedVariant?.sku || product.sku,

        price: product.hasVariants
          ? selectedVariant.sellingPrice
          : product.sellingPrice,

        image: selectedVariant?.imageUrls?.[0] || product.imageUrl,

        quantity: 1,
      };

      addToCart(cartItem);

      showInfo("Product added to cart");
    } catch (error) {
      console.log(error);
      showError("Failed to add product to cart");
    }
  };

  const handleWishlist = () => {
    if (wishlisted) {
      showInfo("Already in wishlist");
      return;
    }

    addToWishlist(product);

    setWishlisted(true);

    showSuccess("Added to wishlist");
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  if (!product) {
    return <h1 className="not-found-text">Product not found</h1>;
  }

  const hasAvailableVariants =
    product.hasVariants && product.variants?.length > 0;

  const currentStock = product.hasVariants
    ? selectedVariant?.stock || 0
    : product.inventory?.stock || 0;

  return (
    <>
      <Navbar />
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-image-section">
            <div className="product-image-wrapper">
              <img
                className="product-image"
                src={
                  selectedVariant?.imageUrls?.[0]
                    ? selectedVariant.imageUrls[0]
                    : product.imageUrl
                }
                alt={product.title}
              />
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.title}</h1>

            <p className="product-description">{product.description}</p>
            {hasAvailableVariants && (
              <div className="variant-section">
                <h3 className="variant-title">Select Variant</h3>

                <div className="variant-list">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      className={`variant-btn ${
                        selectedVariant?._id === variant._id ? "active" : ""
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div>{variant.sku}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h2 className="product-price">
              €.{" "}
              {product.hasVariants
                ? selectedVariant?.sellingPrice || 0
                : product.sellingPrice}
            </h2>

            <div className="product-stock">
              {currentStock === 0 ? (
                <span className="out-stock">Out of Stock</span>
              ) : currentStock <= 5 ? (
                <span className="low-stock">Only {currentStock} left</span>
              ) : (
                <span className="in-stock">In Stock ({currentStock})</span>
              )}
            </div>
            <div className="product-buttons">
              <button
                className="product-btn"
                disabled={selectedVariant?.stock === 0}
                onClick={handleAddToCart}
              >
                {currentStock === 0 ? "Out of Stock" : "Add To Cart"}
              </button>
              <button
                className={`wishlisted-btn ${wishlisted ? "active" : ""}`}
                onClick={handleWishlist}
              >
                {wishlisted ? "♥ Wishlisted" : "♡ Add To Wishlist"}
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
