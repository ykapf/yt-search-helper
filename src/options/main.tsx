import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OptionsApp from "./App";

createRoot(document.getElementById("options-root")!).render(
  <StrictMode>
    <OptionsApp />
  </StrictMode>,
);
