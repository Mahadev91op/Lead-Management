// src/app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="..." suppressHydrationWarning={true}>
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}