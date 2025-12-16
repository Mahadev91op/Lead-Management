import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO & PWA METADATA ---
export const metadata = {
  title: "DevSamp CRM | Best Lead Management System",
  description: "Track leads, manage clients, and boost your agency growth with DevSamp CRM. Simple, fast, and secure.",
  applicationName: "DevSamp CRM",
  authors: [{ name: "Mahadev", url: "https://devsamp.com" }],
  keywords: ["CRM", "Leads", "Business Tool", "DevSamp", "Management"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DevSamp CRM",
  },
  openGraph: {
    title: "DevSamp CRM",
    description: "Manage your agency leads efficiently.",
    url: "https://devsamp.com",
    siteName: "DevSamp",
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}