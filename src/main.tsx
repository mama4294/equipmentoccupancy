import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TitleProvider } from "./contexts/titleContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TitleProvider>
      <App />
    </TitleProvider>
  </StrictMode>
);
