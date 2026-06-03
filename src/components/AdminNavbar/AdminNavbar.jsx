import React from "react";

import { useAuth } from "../../context/AuthContex";
import "./AdminNavbar.css";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <h2 className="admin-navbar-title">Welcome Back!</h2>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-user">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="admin-user-info">
            <h4>{user?.name}</h4>
            <p>Administrator</p>
          </div>
        </div>

        <button className="admin-nav-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
