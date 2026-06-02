import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Orders",
      path: "/admin/orders",
    },
    {
      name: "Payments",
      path: "/admin/payments",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
    },
  ];

  return (
    <div className="admin-sidebar">
      <h1 className="admin-sidebar-title">
        Admin Panel
      </h1>

      <div className="admin-sidebar-links">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-sidebar-link ${
              location.pathname === item.path
                ? "active"
                : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;