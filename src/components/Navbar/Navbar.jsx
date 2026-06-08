import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBox, FaUser } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { getSetting } from "../../services/adminService";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [settings, setSettings] = useState({
      logoName: "NYAshop",
    });

    useEffect(() => {
      const fetchSettings = async () => {
        try {
          const data = await getSetting();
  
          setSettings({
            logoName: data.LOGO_NAME || "NYAshop",
          });
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchSettings();
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        {settings.logoName}
      </div>

      <div className="navbar-actions">
        <button className="nav-icon-btn">
          <Link to="/" className="custom-link">
            <IoHome />
            <span>Home</span>
          </Link>
        </button>

        <button className="nav-icon-btn" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          <span>Cart</span>
        </button>

        {token && (
          <button className="nav-icon-btn" onClick={() => navigate("/order")}>
            <FaBox />
            <span>Orders</span>
          </button>
        )}

        {!token ? (
          <button className="nav-login-btn" onClick={() => navigate("/login")}>
            <FaUser />
            Login
          </button>
        ) : (
          <button className="nav-login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
