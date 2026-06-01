import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContex.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe.js";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>,
  // </React.StrictMode>
);
