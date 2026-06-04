import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/auth/forget-password`, {
    email,
  });
  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, {
    email,
    otp,
  });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    email,
    otp,
    newPassword,
  });
  return response.data;
};
