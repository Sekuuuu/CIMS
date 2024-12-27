// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const Navbar = ({ role, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white text-xl font-bold hover:text-blue-100 transition duration-150"
          >
            Civic Issue System
          </Link>
          <Link
            to="/"
            className="text-white hover:text-blue-100 transition duration-150 px-3 py-2 rounded-md hover:bg-blue-500"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="text-white hover:text-blue-100 transition duration-150 px-3 py-2 rounded-md hover:bg-blue-500"
          >
            Report Issue
          </Link>
          {role === "admin" && (
            <div className="relative group">
              <button className="text-white hover:text-blue-100 transition duration-150 px-3 py-2 rounded-md hover:bg-blue-500 inline-flex items-center">
                <span>Admin</span>
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-1 z-50"
                style={{
                  transitionDelay: "150ms",
                  willChange: "transform, opacity, visibility",
                }}
              >
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/analytics"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150"
                >
                  Analytics
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className="text-white hover:text-blue-100 transition duration-150 px-3 py-2 rounded-md hover:bg-blue-500"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 transition duration-150 px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
