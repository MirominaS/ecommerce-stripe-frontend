import "./Cart.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    const cartItems = getCart();
    setCart({ items: cartItems });
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;

    updateCartItem(productId, quantity);

    fetchCart();
  };

  const handleRemoveItem = (productId) => {
    removeCartItem(productId);

    fetchCart();
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">My Cart</h1>

      {cart?.items?.length > 0 ? (
        <button
          className="checkout-btn"
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) {
              alert("Please login to continue checkout");
              navigate("/login", { state: { from: "/cart" } });
              return;
            }

            navigate("/checkout");
          }}
        >
          Checkout
        </button>
      ) : (
        <button className="checkout-btn" onClick={() => navigate("/")}>
          Back To Home
        </button>
      )}

      {cart?.items?.length === 0 ? (
        <h2 className="empty-cart">Cart is empty</h2>
      ) : (
        <div className="cart-container">
          {cart?.items?.map((item) => (
            <div className="cart-card" key={item._id}>
              <div className="cart-image-wrapper">
                <img className="cart-image" src={item.image} alt={item.title} />
              </div>

              <div className="cart-content">
                <h2 className="cart-product-title">{item.title}</h2>

                <p className="cart-price">${item.price}</p>

                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span className="quantity-text">{item.quantity}</span>

                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="cart-actions">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
