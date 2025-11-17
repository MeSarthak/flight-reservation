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
    <nav className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white shadow-xl sticky top-0 z-50 border-b border-blue-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/admin/dashboard")}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
            <i className="fas fa-plane text-xl"></i>
          </div>
          <h1 className="text-xl font-bold">Flight Admin</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-white/20 backdrop-blur-sm font-semibold shadow-lg"
                    : "hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="ml-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <span className="text-sm font-medium">
              <i className="fas fa-user-circle mr-2"></i>
              {user?.name ? user.name.split(' ')[0] : "Admin"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
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
        <div className="md:hidden bg-blue-600/95 backdrop-blur-sm border-t border-blue-500 animate-slide-up">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-3 border-b border-blue-500/50 hover:bg-white/10 transition-colors ${
                  isActive ? "bg-white/20 font-semibold" : ""
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
            className="w-full text-left px-6 py-3 bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
