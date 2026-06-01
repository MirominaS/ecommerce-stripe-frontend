import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
