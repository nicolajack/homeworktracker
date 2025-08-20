import Navbar from "./components/navbar.js";
import { AssignmentsProvider } from "./context/AssignmentsContext.js";
import "./globals.css";

export const metadata = {
  title: "study buddy",
  description: "track your assignments and homework",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AssignmentsProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 80px)" }}>{children}</main>
        </AssignmentsProvider>
      </body>
    </html>
  );
}
