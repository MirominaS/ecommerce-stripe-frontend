import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
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
    facebook: "https://www.facebook.com/" || "",
    instagram: "https://www.instagram.com/" || "",
    twitter: "https://x.com/" || "",
    linkedin: "https://lk.linkedin.com/" || "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSetting();

        setSettings({
          logoName: data.LOGO_NAME || "NYAshop",
          email: data.EMAIL || "",
          phone: data.PHONE || "",
          copyrightYear:
            data.COPYRIGHT_YEAR || new Date().getFullYear(),
          copyrightText: data.COPYRIGHT_TEXT || "",
          facebook: data.FACEBOOK || "",
          instagram: data.INSTAGRAM || "",
          twitter: data.TWITTER || "",
          linkedin: data.LINKEDIN || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
  }, []);

  // console.log(settings);
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
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            )}

            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaSquareXTwitter />
              </a>
            )}

            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            )}
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
