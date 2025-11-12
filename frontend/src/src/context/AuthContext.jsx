// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken, saveUser, getUser, clearUser } from "../utils/storage";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setAuthToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  // Function to login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      console.log("Login response:", res);
      if (res.data.status && res.data.token) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Optionally fetch user profile here if endpoint exists
      }
        console.log("Storing user info:", res.data);

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password, phone = "") => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    removeToken();
    clearUser();
    setUser(null);
    setAuthToken(null);
  };

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    if (storedToken) setAuthToken(storedToken);
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
