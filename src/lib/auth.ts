import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma as db } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Credenciais inválidas");

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("Usuário não encontrado");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Senha incorreta");

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};
