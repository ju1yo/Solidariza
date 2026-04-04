"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  HandHeart, 
  Users, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Star 
} from "lucide-react"

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
        {/* Background blobs for premium look */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-red-400 opacity-10 rounded-full blur-[80px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold tracking-tight uppercase">Transformando Manaus</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                Sua ajuda <br/>
                <span className="text-red-200">muda o mundo</span> <br/>
                de alguém hoje.
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-red-100 max-w-xl font-medium leading-relaxed">
                O Solidariza é a ponte entre quem quer ajudar e quem precisa de apoio. Doações de alimentos, roupas, remédios e voluntariado em uma só rede segura.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <Button asChild className="h-16 px-10 rounded-2xl bg-white text-red-700 hover:bg-gray-100 text-lg font-black shadow-2xl shadow-red-950/20">
                  <Link href="/register">Começar agora</Link>
                </Button>
                <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-2 border-white/30 bg-transparent hover:bg-white/10 text-white text-lg font-bold">
                  <Link href="/feed">Explorar pedidos</Link>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8">
                 <div className="text-center">
                    <p className="text-3xl font-black">500+</p>
                    <p className="text-xs uppercase font-bold text-red-300">Ajudados</p>
                 </div>
                 <div className="w-px h-10 bg-white/20" />
                 <div className="text-center">
                    <p className="text-3xl font-black">1.2k</p>
                    <p className="text-xs uppercase font-bold text-red-300">Doações</p>
                 </div>
                 <div className="w-px h-10 bg-white/20" />
                 <div className="text-center">
                    <p className="text-3xl font-black">200+</p>
                    <p className="text-xs uppercase font-bold text-red-300">Voluntários</p>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-white/10">
                 <img 
                   src="/illustration-help-card.png" 
                   alt="App interface concept" 
                   className="w-full h-auto"
                 />
              </div>
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl text-red-600 flex items-center gap-4 border border-red-50"
              >
                  <div className="bg-red-50 p-3 rounded-2xl"><Heart className="w-8 h-8 fill-current" /></div>
                  <div>
                    <p className="text-xs font-black uppercase text-gray-400">Nova Doação</p>
                    <p className="font-extrabold text-gray-900">Família ajudada!</p>
                  </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 bg-blue-600 p-6 rounded-3xl shadow-2xl text-white flex items-center gap-4 border border-blue-500"
              >
                  <div className="bg-white/20 p-3 rounded-2xl"><HandHeart className="w-8 h-8" /></div>
                  <div>
                    <p className="text-xs font-bold text-blue-100 uppercase">Rede Ativa</p>
                    <p className="font-extrabold">+15 solicitações hoje</p>
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black text-gray-900 md:text-5xl">Como funciona o <span className="text-red-600">Solidariza</span>?</h2>
            <p className="text-lg text-muted-foreground font-semibold">Tornamos o processo de doação simples, seguro e gratificante para todos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Peça Ajuda", desc: "Descreva sua necessidade com fotos e lista de itens em segundos.", icon: ArrowRight, color: "bg-red-50 text-red-600" },
              { title: "Doe sem Burocracia", desc: "Navegue pelo feed filtrado por categoria e localização.", icon: HandHeart, color: "bg-blue-50 text-blue-600" },
              { title: "Mapa Interativo", desc: "Visualize pedidos de ajuda próximos a você em tempo real.", icon: MapPin, color: "bg-orange-50 text-orange-600" },
              { title: "Segurança Total", desc: "Identidade verificada e sistema de histórico de confiabilidade.", icon: ShieldCheck, color: "bg-green-50 text-green-600" },
              { title: "Feedback Direto", desc: "Saiba exatamente quando seu auxílio chegou ao destino.", icon: Zap, color: "bg-purple-50 text-purple-600" },
              { title: "Comunidade Viva", desc: "Chat integrado e sistema de avaliações entre usuários.", icon: Users, color: "bg-pink-50 text-pink-600" },
            ].map((f, i) => (
              <motion.div 
                key={f.title}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[40px] shadow-lg border border-gray-100 group transition-all"
              >
                <div className={`${f.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900">{f.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24">
         <div className="container mx-auto px-4">
            <div className="bg-gray-900 rounded-[50px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 opacity-20 blur-[120px] -translate-y-1/2 translate-x-1/3" />
               <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">Vamos construir esse <br/>impacto juntos?</h2>
                  <p className="text-gray-400 text-lg font-semibold italic">&quot;A solidariedade é o aluguel que pagamos pelo nosso lugar nesta terra.&quot;</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <Button asChild className="h-16 px-12 rounded-2xl bg-red-600 hover:bg-red-700 text-lg font-black w-full sm:w-auto shadow-2xl shadow-red-900/40">
                      <Link href="/register">Fazer meu cadastro</Link>
                    </Button>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">ou</p>
                    <Button asChild variant="ghost" className="h-16 px-12 rounded-2xl border-white/10 border hover:bg-white/5 text-lg font-bold w-full sm:w-auto">
                       <Link href="/feed">Ver causas ativas</Link>
                    </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-xl"><Image src="/logo_no_bg.png" alt="Logo" width={30} height={30} /></div>
              <span className="font-black text-2xl tracking-tighter">Solidariza</span>
           </div>
           <nav className="flex gap-8 text-sm font-black text-gray-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-red-600 transition-colors">Termos</Link>
              <Link href="#" className="hover:text-red-600 transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-red-600 transition-colors">Contato</Link>
           </nav>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">© 2026 Solidariza. Manaus, AM.</p>
        </div>
      </footer>
    </div>
  )
}
