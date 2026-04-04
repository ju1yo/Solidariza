import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl;
    const pathname = url.pathname;

    // 1️⃣ Not logged in -> handled by next-auth/middleware automatically if config.matcher matches
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2️⃣ Admin Protection
    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin" && token.role !== "instituicao") {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }

    // 3️⃣ Feed is public-ish but behind auth in matcher
    // Solicitacoes is for everyone who can create or view their own
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/feed/:path*",
    "/chat/:path*",
    "/perfil/:path*",
    "/solicitacoes/:path*",
  ],
};
