// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssueDetailsPage from "./pages/IssueDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { logoutUser } from "./services/authService";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const location = window.location.pathname;
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("role"));
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  // Check if current path is login or register
  const hideNavbar = location === '/login' || location === '/register';

  return (
    <Router>
      {!hideNavbar && (
        <Navbar isAuthenticated={isAuthenticated} role={userRole} onLogout={handleLogout} />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={isAuthenticated ? <CreateIssuePage /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/issue/:id" element={<IssueDetailsPage />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={isAuthenticated && userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route 
          path="/admin/analytics" 
          element={isAuthenticated && userRole === "admin" ? <AnalyticsDashboard /> : <Navigate to="/" />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
