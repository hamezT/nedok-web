import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home/Home";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
