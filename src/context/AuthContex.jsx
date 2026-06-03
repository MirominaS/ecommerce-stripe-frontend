import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;});

  const login = (tokenData, userData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user",JSON.stringify(userData))
    setToken(tokenData);
    setUser(userData)
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
