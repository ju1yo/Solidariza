import type { Metadata } from "next";
<<<<<<< HEAD
import "./globals.css";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import Providers from "@/components/Providers";
=======
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Providers from "@/components/providers/SessionProvider";
>>>>>>> main

export const metadata: Metadata = {
  title: "Solidariza",
  description: "Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
<<<<<<< HEAD
          <HeaderWrapper />
=======
          <Toaster position="top-right" />
>>>>>>> main
          {children}
        </Providers>
      </body>
    </html>
  );
}
