import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getVariantsByProduct = async (productId) => {
  const response = await axios.get(`${API_URL}/variants/product/${productId}`);

  return response.data.variants;
};

export const createVariant = async (productId, data, token) => {
  const response = await axios.post(
    `${API_URL}/variants/product/${productId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getVariantById = async (variantId) => {
  const response = await axios.get(`${API_URL}/variants/${variantId}`);

  return response.data;
};

export const deleteVariant = async (variantId, token) => {
  const response = await axios.delete(`${API_URL}/variants/${variantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateVariant = async (variantId, data, token) => {
  const response = await axios.put(`${API_URL}/variants/${variantId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
