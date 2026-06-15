import "./Cart.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem,} from "../../services/cartService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

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

 const handleQuantityChange = (
  productId,
  variantId,
  quantity
) => {
  updateCartItem(
    productId,
    variantId,
    quantity
  );
  fetchCart();
};

const handleRemoveItem = (
  productId,
  variantId
) => {
  removeCartItem(productId, variantId);
  fetchCart();
};

  const subtotal =
    cart?.items?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) || 0;

  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to continue checkout");

      navigate("/login", {
        state: { from: "/cart" },
      });

      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return <h1 className="loading-text">Loading...</h1>;
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1 className="cart-title">My Cart ({totalItems} Items)</h1>

        {cart?.items?.length === 0 ? (
          <div className="empty-cart-container">
            <h2>Your Cart Is Empty</h2>

            <p>Looks like you haven't added any products yet.</p>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* CART ITEMS */}

            <div className="cart-items">
              {cart.items.map((item) => (
                <div className="cart-card" key={item._id}>
                  <div className="cart-image-wrapper">
                    <img
                      className="cart-image"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div className="cart-content">
                    <div className="cart-top">
                      <div>
                        <h2 className="cart-product-title">{item.title}</h2>

                        <p className="cart-price">€{item.price}</p>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemoveItem(  item._id,
    item.variantId)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="cart-bottom">
                      <div className="quantity-container">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange( item._id,
    item.variantId,
    item.quantity - 1)
                          }
                        >
                          -
                        </button>

                        <span className="quantity-text">{item.quantity}</span>

                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange( item._id,
    item.variantId,
    item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <p className="item-total">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>

                <span>{totalItems}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>

                <span>€{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>

                <span>Free</span>
              </div>

              <div className="summary-total">
                <span>Total</span>

                <span>€{subtotal.toFixed(2)}</span>
              </div>

              <button className="summary-checkout-btn" onClick={handleCheckout}>
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
        <Footer/>
      </div>
    </>
  );
};

export default Cart;
