// Entry for the home page only. The inner pages keep src/main.jsx and their
// own stylesheets, so the two designs never share global CSS.
import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage.jsx";
import "./home.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
