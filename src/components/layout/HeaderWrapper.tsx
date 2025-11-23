"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  // páginas sem header
  const hideHeader = pathname === "/login" || pathname === "/register";

  if (hideHeader) return null;

  return (
    <header className="w-full bg-[#7A0006] px-10 py-4 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Link href="/home">
          <Image src="/logo_no_bg.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>

      {/* MENU LINKS */}
      <div className="flex gap-10 items-center">
        <Link href="/chat">
        <i className="bi bi-chat-square-text" style={{ fontSize: "20px", background:"white", padding:"10px", borderRadius:"50%" }}></i>
        </Link>
        <Link href="/perfil">
        <i className="bi bi-person-fill" style={{ fontSize: "20px",background:"white", padding:"10px", borderRadius:"50%" }}></i>
        </Link>
        <Link href="/solicitacoes">
        <i className="bi bi-columns-gap" style={{ fontSize: "20px",background:"white", padding:"10px", borderRadius:"50%"}}></i>
        </Link>
        <Link href="/dashboard">
        <i className="bi bi-house" style={{ fontSize: "20px",background:"white", padding:"10px", borderRadius:"50%"}}></i>
        </Link>
      </div>

      {/* AREA DIREITA — LOGIN / REGISTER OU PERFIL */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">
              Olá, {user.name?.split(" ")[0]}!
            </span>
            <button
              onClick={() => signOut()}
              className="bg-white text-red-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Registro
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
