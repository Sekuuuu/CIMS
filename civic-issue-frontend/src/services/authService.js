// src/services/authService.js
import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post("/users/login", userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};
