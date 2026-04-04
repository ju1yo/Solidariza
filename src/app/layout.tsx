import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import Providers from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Solidariza | Conectando Corações em Manaus",
  description: "Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança. Doações, voluntariado e impacto social.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Solidariza",
  },
};

export const viewport: Viewport = {
  themeColor: "#7A0006",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderWrapper />
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
