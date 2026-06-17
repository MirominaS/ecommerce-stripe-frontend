import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sort = "",
  maxPrice = "",
  minPrice = "",
) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: {
      page,
      limit,
      search,
      category,
      sort,
      maxPrice,
      minPrice,
    },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const importProducts = async (products, token) => {
  const response = await axios.post(
    `${API_URL}/products/import`,
    {
      products,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await axios.get(`${API_URL}/products/low-stock`);

  return response.data;
};
