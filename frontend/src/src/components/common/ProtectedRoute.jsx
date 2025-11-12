// src/components/common/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, setAuthToken, setUser } = useContext(AuthContext);
  console.log("ProtectedRoute - user:", user, "token:", token, "adminOnly:", adminOnly);
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
