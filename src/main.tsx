import ClickSpark from "./components/TextAnimations/ClickSpark/ClickSpark";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClickSpark
      sparkColor="#D4AF37"
      sparkSize={12}
      sparkRadius={22}
      sparkCount={10}
      duration={500}
    >
      <App />
    </ClickSpark>
  </StrictMode>
);
