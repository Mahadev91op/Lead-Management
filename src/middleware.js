import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "mysecretkey");

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Login page aur public assets ko protect nahi karna hai
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname === "/login" || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Agar token nahi hai to Login par bhejo
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Token verify karo
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/api/leads/:path*"], // In routes ko protect karo
};