import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createStockAdjustment = async (adjustmentData, token) => {
  const response = await axios.post(
    `${API_URL}/stock-adjustments`,
    adjustmentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getStockAdjustments = async (token) => {
  const response = await axios.get(`${API_URL}/stock-adjustments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStockAdjustmentById = async (id, token) => {
  const response = await axios.get(`${API_URL}/stock-adjustments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
