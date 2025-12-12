import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import Context

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="...">
        <AuthProvider> {/* Wrap kijiye */}
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}