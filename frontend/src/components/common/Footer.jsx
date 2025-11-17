import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-plane text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold">SkyFly</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner for seamless flight reservations. Book your next journey with us and experience the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/flights" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Flights
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <i className="fas fa-envelope text-primary-500 mt-1"></i>
                <span>support@skyfly.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <i className="fas fa-phone text-primary-500 mt-1"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <i className="fas fa-map-marker-alt text-primary-500 mt-1"></i>
                <span>123 Aviation Blvd, Sky City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 SkyFly. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

