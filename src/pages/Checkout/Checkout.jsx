import React, { useEffect, useState } from "react";
import "./Checkout.css";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../stripe";
import {
  createCheckout,
  createBuyNowCheckout,
} from "../../services/paymentService";
import { useParams } from "react-router-dom";

const Checkout = () => {
  const { productId } = useParams();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const token = localStorage.getItem("token");

        const data = productId
          ? await createBuyNowCheckout(productId, token)
          : await createCheckout(
              JSON.parse(localStorage.getItem("cart")) || [],
              token,
            );

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCheckout();
  }, []);

  if (!clientSecret) {
    return (
      <div className="checkout-loading">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Secure Checkout</h1>

        <div className="checkout-wrapper">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
