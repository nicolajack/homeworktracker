import Navbar from "./components/navbar.js";
import { AssignmentsProvider } from "./context/AssignmentsContext.js";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { THEME_STORAGE_KEY, findPaletteById, applyPaletteVars } from "./theme";

export const metadata = {
  title: "study buddy",
  description: "track your assignments and homework",
  icons: {
    icon: "/favicon.ico",
  },
};

function applySavedThemeOnLoad() {
  if (typeof window === "undefined") return;
  try {
    const savedThemeId = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!savedThemeId) return;

    const palette = findPaletteById(savedThemeId);
    if (!palette) return;

    applyPaletteVars(palette);
  } catch (e) {
    console.error("Failed to apply saved theme", e);
  }
}

export default function RootLayout({ children }) {
  if (typeof window !== "undefined") {
    applySavedThemeOnLoad();
  }

  return (
    <html lang="en">
      <body>
        <AssignmentsProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 80px)" }}>{children}</main>
        </AssignmentsProvider>
        <Analytics />
      </body>
    </html>
  );
}
