import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createPurchase = async (
  purchaseData,
  token,
) => {
  const response = await axios.post(
    `${API_URL}/purchases`,
    purchaseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getPurchases = async (
  token,
) => {
  const response = await axios.get(
    `${API_URL}/purchases`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getPurchaseById = async (
  id,
  token,
) => {
  const response = await axios.get(
    `${API_URL}/purchases/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};