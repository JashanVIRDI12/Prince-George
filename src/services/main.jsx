// Entry for the services page and the five service pages. They share the
// home page's header, footer, type and motion, plus their own stylesheet.
import React from "react";
import { createRoot } from "react-dom/client";
import ServicesApp from "./ServicesApp.jsx";
import "../home/home.css";
import "./services.css";

const id = window.location.pathname.match(
  /^\/services\/(towing|roadside|heavy|equipment|offloading)(?:\/(?:index\.html)?)?$/,
)?.[1];

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ServicesApp id={id} />
  </React.StrictMode>,
);
