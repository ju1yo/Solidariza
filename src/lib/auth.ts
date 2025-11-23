import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma as db } from "./prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // VAI COM AS CONSOLES MESMO PQ TA PAIA 
        console.log("1.AUTORIZAÇÃO Tentando autorizar usuário:", credentials?.email);

        if (!credentials?.email || !credentials.password) {
          console.error("1.1. [AUTORIZAÇÃO] Erro: E-mail ou senha ausentes.");
          throw new Error("Credenciais inválidas");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          console.error("1.2 AUTORIZAÇLLÃO  Erro: Usuário não encontrado no banco de dados.");
          throw new Error("Usuário não encontrado");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.error("1.3. AUTORIZAÇÃO Erro: Senha inválida.");
          throw new Error("Senha incorreta");
        }

        console.log("1.4. AUTORIZAÇÃO Usuário autorizado com sucesso. Retornando objeto user:", user);
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      console.log("2. [JWT CALLBACK] Iniciado.");
      console.log("   - Token recebido:", token);

      if (user) {
        // por incrivel que pareca, essa condição nao funciona 
        console.log("Objeto 'user' recebido (indica login):", user);
        token.id = user.id;
        token.role = user.role;
      }

      console.log("Token final a ser retornado:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("3. SESSION CALLBACK Iniciado.");
      console.log("Token recebido do callback JWT:", token);
      console.log("Sessão antes da modificação:", session);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;

      }

      console.log("Sessão final a ser retornada para o cliente:", session);
      return session;
    },
  },
};