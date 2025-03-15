import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import PageTransition from "./components/PagetRANSITION.JSX";
import ThreeDBackground from "./components/ThreeDBackground.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <PageTransition>
        <ThreeDBackground />
        <App />
      </PageTransition>
    </ThemeProvider>
  </StrictMode>
);
