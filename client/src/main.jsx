import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./contexts/cartContext.jsx";
import { TableProvider } from "./contexts/tableContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TableProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </TableProvider>
  </React.StrictMode>,
);
