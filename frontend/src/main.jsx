import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// Bootstrap JS (optional)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
