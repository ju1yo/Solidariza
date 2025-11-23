import "next-auth";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Estende o token JWT padrão para incluir as propriedades personalizadas. */
  interface JWT extends DefaultJWT {
    id: string;
    role?: string;
  }
}