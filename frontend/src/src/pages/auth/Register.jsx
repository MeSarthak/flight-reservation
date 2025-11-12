// src/pages/auth/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(form.name, form.email, form.password, form.phone);
      if (res.status) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(res.message || "Failed to register.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Phone (optional)</label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
