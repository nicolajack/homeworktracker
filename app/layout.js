import Navbar from "./components/navbar.js";
import { AssignmentsProvider } from "./context/AssignmentsContext.js";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { THEME_STORAGE_KEY, findPaletteById, applyPaletteVars } from "./theme";
import AnnouncementBanner from "./components/AnnouncementBanner.js";

export const metadata = {
  metadataBase: new URL("https://homeworktracker-eight.vercel.app"),
  title: {
    default: "Study Buddy — Homework Tracker & Assignment Planner",
    template: "%s — Study Buddy",
  },
  description:
    "Track assignments, manage due dates, and stay on top of your homework with Study Buddy. Free student planner with pomodoro timer, calendar, and to-do lists.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "Study Buddy",
    locale: "en_US",
    url: "https://homeworktracker-eight.vercel.app",
  },
  twitter: {
    card: "summary",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Study Buddy",
              "url": "https://homeworktracker-eight.vercel.app",
              "description":
                "Track assignments, manage due dates, and stay on top of your homework. Free student planner with pomodoro timer, calendar, and to-do lists.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
            }),
          }}
        />
      </head>
      <body>
        <AssignmentsProvider>
          <Navbar />
          <AnnouncementBanner/>
          <main style={{ minHeight: "calc(100vh - 80px)" }}>{children}</main>
        </AssignmentsProvider>
        <Analytics />
      </body>
    </html>
  );
}
