import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./experience.css";
import "./company.css";
import "./brand.css";
import "./navigation.css";

const pathname = window.location.pathname;
const detailId = pathname.match(
  /^\/services\/(towing|roadside|heavy)(?:\/(?:index\.html)?)?$/,
)?.[1];
const page = detailId
  ? `service-${detailId}`
  : pathname.match(/^\/(services|about|contact)(?:\/(?:index\.html)?)?$/)?.[1] || "home";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App page={page} />
  </React.StrictMode>,
);
