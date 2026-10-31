// Entry for the About and Contact pages. They share the home page's header,
// footer, type and motion, plus their own stylesheet.
import React from "react";
import { createRoot } from "react-dom/client";
import CompanyApp from "./CompanyApp.jsx";
import "../home/home.css";
import "./pages.css";

const page = window.location.pathname.startsWith("/contact") ? "contact" : "about";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CompanyApp page={page} />
  </React.StrictMode>,
);
