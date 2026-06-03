import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAdminSummary = async (token) => {
    const response = await axios.get(
        `${API_URL}/admin/summary`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data
}

export const getAdminAnalytics = async (
  token,
  date = "",
  month = ""
) => {
  const response = await axios.get(
    `${API_URL}/admin/analytics`,
    {
      params: {
        date,
        month,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminProducts = async (token) => {
  const response = await axios.get(
    `${API_URL}/products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createProduct = async (
  productData,
  token
) => {
  const response = await axios.post(
    `${API_URL}/products`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProduct = async (
  id,
  productData,
  token
) => {
  const response = await axios.put(
    `${API_URL}/products/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteProduct = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// GET ALL USERS
export const getAdminUsers = async (token, params = {}) => {
  const response = await axios.get(`${API_URL}/auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

// GET USER BY ID
export const getAdminUserById = async (token, id) => {
  const response = await axios.get(`${API_URL}/auth/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE USER
export const updateAdminUser = async (token, id, data) => {
  const response = await axios.put(
    `${API_URL}/auth/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// DELETE (deactivate) USER
export const deleteAdminUser = async (token, id) => {
  const response = await axios.delete(
    `${API_URL}/auth/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};