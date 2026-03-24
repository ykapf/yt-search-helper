import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PopupApp from "./App";

createRoot(document.getElementById("popup-root")!).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>,
);
