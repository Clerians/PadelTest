// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//import "./styles/LoginForm.css"; // Aplica el CSS global y del login


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
