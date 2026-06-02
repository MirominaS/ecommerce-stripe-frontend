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

export const getAllOrders = async (
  token,
  {
    page = 1,
    limit = 10,
    status = "",
    search = "",
  }
) => {
  const response = await axios.get(
    `${API_URL}/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      params: {
        page,
        limit,
        status,
        search,
      },
    }
  );

  return response.data;
};

export const updateOrderStatus = async (
  id,
  status,
  token
) => {
  const response = await axios.put(
    `${API_URL}/orders/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteOrder = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};