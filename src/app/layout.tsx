import type { Metadata } from "next";
import "./globals.css"; // Certifique-se de que este arquivo existe

export const metadata: Metadata = {
  title: "Solidariza",
  description: "Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}