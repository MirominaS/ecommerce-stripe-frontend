import React, { useState } from "react";
import "./Login.css";

import { useAuth } from "../../context/AuthContex.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authService.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(loginData);

      login(data.token, data.user);

      alert("Login successful");

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from === "/cart" ? "/checkout" : from);
      }
    } catch (error) {
      console.error(error);

      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <p
            className="forgot-password-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
