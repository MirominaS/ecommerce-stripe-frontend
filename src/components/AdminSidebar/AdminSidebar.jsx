import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Users", path: "/admin/users" },
    { name: "Setting", path: "/admin/setting" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <h1 className="admin-sidebar-title">Admin Panel</h1>

        <div className="admin-sidebar-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <button className="admin-side-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
