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
  authors: [{ name: "Mahadev", url: "https://devsamp.com" }], // अपना असली डोमेन यहाँ डालें
  keywords: ["CRM", "Leads", "Business Tool", "DevSamp", "Management", "Agency"],
  manifest: "/manifest.json",
  
  // Icons configuration (SVG aur PNG dono ka use)
  icons: {
    icon: "/icon.svg", // Browser tab ke liye SVG (Sharp dikhega)
    shortcut: "/icon.svg",
    apple: "/icon-512.png", // iPhone/iPad ke liye high-res PNG
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icon-512.png",
    },
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DevSamp CRM",
  },
  
  openGraph: {
    title: "DevSamp CRM",
    description: "Manage your agency leads efficiently.",
    url: "https://devsamp.com", // अपना असली डोमेन यहाँ डालें
    siteName: "DevSamp",
    locale: "en_US",
    type: "website",
  },
};

// --- VIEWPORT SETTINGS FOR MOBILE ---
export const viewport = {
  themeColor: "#f8fafc", // Background color match karega status bar se
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App jaisa feel dene ke liye zoom disable kiya
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning extensions ke errors ko rokega
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