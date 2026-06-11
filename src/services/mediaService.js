import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMedia = async () => {
    const token = localStorage.getItem("token")

     const response = await axios.get(`${API_URL}/media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const uploadMedia = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/media/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const deleteMedia = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/media/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMediaAccessUrl = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/media/${id}/url`,
     {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data;
}