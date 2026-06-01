import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createCheckout = async (items, token) => {
  const response = await axios.post(
    `${API_URL}/payments/create-checkout`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const paymentSuccess = async (sessionId, items, token) => {
  const response = await axios.post(
    `${API_URL}/payments/payment-success`,
    { sessionId, items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const createBuyNowCheckout = async (productId, token) => {
  const response = await axios.post(
    `${API_URL}/payments/buy-now/${productId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
