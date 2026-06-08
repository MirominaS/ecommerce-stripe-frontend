import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSetting } from "../../services/adminService";

const Footer = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    logoName: "NYAshop",
    email: "support@nyashop.com",
    phone: "+94 77 123 4567",
    copyrightYear: new Date().getFullYear(),
    copyrightText: "All Rights Reserved.",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSetting();

        setSettings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-logo">{settings.logoName}</h2>

          <p>
            Discover premium products with secure payments and fast delivery.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/cart")}>Cart</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>

          <ul>
            <li>Help Center</li>
            <li>Shipping Info</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>Email: {settings.email}</p>

          <p>Phone: {settings.phone}</p>

          <div className="footer-socials">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {settings.copyrightYear} {settings.logoName}. {settings.copyrightText}
      </div>
    </footer>
  );
};

export default Footer;
