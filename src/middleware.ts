import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/chat/:path*",
    "/perfil/:path*",
    "/solicitacoes/:path*",
  ],
};
