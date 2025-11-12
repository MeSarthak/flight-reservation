// src/components/admin/AdminNavbar.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/manage-flights", label: "Flights" },
    { path: "/admin/manage-aircrafts", label: "Aircrafts" },
    { path: "/admin/manage-airports", label: "Airports" },
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          ✈️ Flight Admin
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-gray-200 transition ${
                  isActive ? "font-semibold underline" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <span className="text-sm text-gray-300 ml-4">
            {user?.name ? `Hello, ${user.name}` : "Admin"}
          </span>

          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 border-t border-blue-500">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-2 border-b border-blue-500 hover:bg-blue-500 ${
                  isActive ? "bg-blue-500 font-semibold" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full text-left px-6 py-2 bg-red-500 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
