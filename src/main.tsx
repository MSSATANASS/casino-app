import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./lib/auth";
import { LedgerProvider } from "./lib/ledger";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <LedgerProvider>
        <App />
      </LedgerProvider>
    </AuthProvider>
  </React.StrictMode>
);
