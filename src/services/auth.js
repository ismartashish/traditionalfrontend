import axios from "axios";

const API_URL = "https://traditionalbackend-1.onrender.com/api/auth";

/* ================= LOGIN ================= */
export const loginUser = async (formData) => {
  return axios.post(`${API_URL}/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* ================= REGISTER ================= */
export const registerUser = async (formData) => {
  return axios.post(`${API_URL}/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (token, password) => {
  return axios.post(`${API_URL}/reset-password/${token}`, { password });
};
