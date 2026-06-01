import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NotificacionProvider } from "./context/NotificacionContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificacionProvider>
      <App />
    </NotificacionProvider>
  </React.StrictMode>
);
