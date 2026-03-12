import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { publicEnv } from "./config/publicEnv";
import { initPixel } from "./lib/metaPixel";

// Pixel inicializado antes do React montar — garante rastreamento imediato
initPixel();

console.info("[Boot] Starting application...", { env: publicEnv.isDev ? "dev" : "prod" });

try {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    createRoot(rootElement).render(<App />);
    console.info("[Boot] Application mounted.");
} catch (error) {
    console.error("[Boot] Failed to mount application:", error);
}
