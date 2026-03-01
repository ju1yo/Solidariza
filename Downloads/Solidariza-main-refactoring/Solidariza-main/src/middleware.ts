import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl;

    // 1️⃣ Se NÃO estiver logado → manda para login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2️⃣ Proteção por ROLE
    // Exemplo: só instituição pode acessar /solicitacoes
    const pathname = url.pathname;

    if (pathname.startsWith("/solicitacoes")) {
      if (token.role !== "instituicao") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/doador")) {
      if (token.role !== "doador") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/receptor")) {
      if (token.role !== "receptor") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // vamos controlar manualmente acima
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/chat/:path*",
    "/perfil/:path*",
    "/solicitacoes/:path*",
  ],
};
