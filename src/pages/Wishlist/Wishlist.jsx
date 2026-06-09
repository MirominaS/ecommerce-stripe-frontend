import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaTrash } from "react-icons/fa";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    setWishlist(getWishlist());
  };
  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Add products to save them for later.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product._id}>
                <div className="wishlist-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="wishlist-image"
                  />
                </div>

                <div className="wishlist-content">
                  <p className="wishlist-category">{product.category}</p>

                  <h3 className="wishlist-product-title">{product.title}</h3>

                  <div className="wishlist-price">${product.price}</div>

                  <div className="wishlist-actions">
                    <button
                      className="move-cart-btn"
                      onClick={() => handleMoveToCart(product)}
                    >
                      Move To Cart
                    </button>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(product._id)}
                    >
                      <FaTrash />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
