import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";  // <-- changer ici
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
