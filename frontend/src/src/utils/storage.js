// src/utils/storage.js

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const saveUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
export const clearUser = () => localStorage.removeItem("user");
