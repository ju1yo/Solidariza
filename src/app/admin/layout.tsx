"use client"

import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50/50"><Loader2 className="animate-spin w-10 h-10 text-red-600" /></div>
  }

  // Double check role in layout
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "instituicao"
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50/50 p-10 text-center gap-6">
         <div className="bg-red-100 p-6 rounded-full">
            <ShieldAlert className="w-16 h-16 text-red-600" />
         </div>
         <h1 className="text-3xl font-black text-red-900 uppercase tracking-tighter">Acesso Restrito</h1>
         <p className="text-red-700 font-bold max-w-md">Você não possui as permissões necessárias para acessar esta área reservada a administradores.</p>
         <Button asChild className="rounded-2xl h-14 px-10 bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 font-bold text-lg">
            <Link href="/home">Voltar para Home</Link>
         </Button>
      </div>
    )
  }

  return <>{children}</>
}
