import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Solidariza",
  description: "Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <HeaderWrapper />
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
