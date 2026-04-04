"use client"

import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/useNotifications"
import { useTheme } from "@/hooks/useTheme"
import {
  Bell,
  LogOut,
  User,
  MessageSquare,
  LayoutDashboard,
  PlusCircle,
  Home,
  Check,
  Circle,
  Moon,
  Sun
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { theme, toggleTheme } = useTheme()

  const hideHeader = pathname === "/login" || pathname === "/register"
  if (hideHeader) return null

  const navLinks = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/feed", icon: MessageSquare, label: "Feed" },
    { href: "/solicitacoes", icon: LayoutDashboard, label: "Pedidos" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  ]

  return (
    <header className="w-full bg-[#7A0006] sticky top-0 z-50 shadow-lg px-4 md:px-8 py-3 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Link href="/home" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="bg-white p-1.5 rounded-xl shadow-inner">
            <Image src="/logo_no_bg.png" alt="Logo" width={34} height={34} className="group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-white font-black text-xl tracking-tighter hidden sm:block">
            Solidariza
          </span>
        </Link>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex items-center bg-black/10 rounded-2xl px-2 py-1.5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
              pathname.startsWith(link.href)
                ? "bg-white text-red-800 shadow-md scale-105"
                : "text-red-100 hover:bg-white/10"
            }`}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* THEME TOGGLE */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-white hover:bg-white/10 rounded-full h-11 w-11"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* NOTIFICATIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 rounded-full h-11 w-11">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[10px] font-black text-white ring-2 ring-[#7A0006] animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-2xl p-0 overflow-hidden border-0">
                <div className="bg-gray-50/80 p-4 flex items-center justify-between border-b">
                  <DropdownMenuLabel className="p-0 font-black text-lg">Notificações</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="h-8 text-[10px] font-bold text-red-600 hover:bg-red-50"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground italic flex flex-col items-center gap-4">
                       <Bell className="w-8 h-8 opacity-20" />
                       Tudo em dia! Nenhuma notificação.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem 
                        key={n.id} 
                        className={`p-4 cursor-pointer border-b last:border-0 hover:bg-gray-50 focus:bg-gray-50 flex gap-3 transition-colors ${!n.read ? "bg-red-50/30" : ""}`}
                        onSelect={() => {
                          if (!n.read) markAsRead(n.id)
                          if (n.link) window.location.href = n.link
                        }}
                      >
                        <div className={`mt-1 p-2 rounded-full ${!n.read ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}>
                           {!n.read ? <Circle className="w-3 h-3 fill-current" /> : <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold leading-tight ${!n.read ? "text-gray-900" : "text-gray-500"}`}>{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">
                            {formatDistanceToNow(new Date(n.createdAt), { locale: ptBR, addSuffix: true })}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* USER PROFILE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:flex items-center pl-1.5 pr-4 py-1 h-11 bg-white/10 hover:bg-white/20 rounded-full border-0 gap-3 ring-1 ring-white/20">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <Image src={user.image} alt="User Avatar" width={32} height={32} />
                    ) : (
                      <span className="text-[#7A0006] font-black text-xs">{user.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight truncate max-w-[100px]">
                    {user.name?.split(" ")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl mt-2 p-1.5 overflow-hidden">
                <DropdownMenuLabel className="px-3 py-2 text-xs uppercase font-bold tracking-widest text-muted-foreground">Sua Conta</DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl cursor-not-allowed">
                   <Link href="/perfil" className="flex items-center py-2.5 font-bold"><User className="w-4 h-4 mr-3" /> Ver Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="rounded-xl text-red-600 focus:text-red-700 font-bold py-2.5">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sair do sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* MOBILE ONLY ACTIONS */}
            <div className="md:hidden flex items-center gap-2">
               <Button asChild size="icon" variant="ghost" className="text-white rounded-full">
                  <Link href="/feed"><MessageSquare className="w-6 h-6"/></Link>
               </Button>
               <Button onClick={() => signOut()} size="icon" variant="ghost" className="text-white rounded-full">
                  <LogOut className="w-6 h-6"/>
               </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-white text-red-800 hover:bg-gray-100 rounded-xl font-bold px-6">
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
