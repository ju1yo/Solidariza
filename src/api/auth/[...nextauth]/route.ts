
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Debug logs (temporários): não registrar senhas em produção
        console.log("[nextauth] authorize called, email:", credentials?.email ? credentials.email : "<no-email>");
        if (!credentials?.email || !credentials?.password) {
          console.log("[nextauth] missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        console.log("[nextauth] user found:", !!user, user?.email ?? null);

        if (!user) return null;

        let valid = false;
        try {
          valid = await bcrypt.compare(credentials.password, user.password);
        } catch (err) {
          console.error("[nextauth] bcrypt.compare error:", err);
          return null;
        }
        console.log("[nextauth] password valid:", valid);

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // user comes from authorize()
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };