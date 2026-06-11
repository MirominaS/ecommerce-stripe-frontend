// services/folderService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getFolders = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/folders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createFolder = async (name) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/folders`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteFolder = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/folders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
