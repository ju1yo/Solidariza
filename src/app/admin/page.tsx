"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  Trash2, 
  ExternalLink,
  Loader2,
  PieChart,
  Activity
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import toast from "react-hot-toast"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdAt: string
}

interface AdminRequest {
  id: string
  title: string
  status: string
  createdAt: string
  author: { name: string, email: string }
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, reqRes, metRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/help-requests/search"), // simplified for admin list
        fetch("/api/admin/metrics")
      ])
      
      if (usersRes.ok) setUsers((await usersRes.json()).users)
      if (reqRes.ok) setRequests(await reqRes.json())
      if (metRes.ok) setMetrics(await metRes.json())
    } catch (err) {
      toast.error("Erro ao carregar dados administrativos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleUser = async (userId: string, active: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, active: !active }),
      })
      if (!res.ok) throw new Error()
      toast.success(active ? "Usuário desativado" : "Usuário reativado")
      fetchData()
    } catch (err) {
      toast.error("Erro ao alterar status do usuário.")
    }
  }

  if (loading && !metrics) {
      return <div className="p-20 flex justify-center"><Loader2 className="animate-spin w-10 h-10 text-red-600" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
               <ShieldCheck className="w-10 h-10 text-red-600" />
               Painel <span className="text-red-600">Administrativo</span>
            </h1>
            <p className="text-muted-foreground font-semibold mt-1 italic">Gerenciamento de usuários e moderação de conteúdo.</p>
          </div>
          <Badge variant="outline" className="h-10 px-6 rounded-2xl bg-white border-red-100 font-bold text-red-700 shadow-sm">
            Acesso Restrito
          </Badge>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[
             { label: "Usuários", value: metrics?.totalUsers, icon: Users, color: "bg-blue-500" },
             { label: "Pedidos", value: metrics?.totalRequests, icon: FileText, color: "bg-red-500" },
             { label: "Doações", value: metrics?.totalDonations, icon: Activity, color: "bg-green-500" },
             { label: "Mensagens", value: metrics?.totalMessages, icon: PieChart, color: "bg-orange-500" },
           ].map(m => (
             <Card key={m.label} className="rounded-3xl border-0 shadow-lg overflow-hidden relative">
               <div className={`absolute top-0 left-0 w-1.5 h-full ${m.color}`} />
               <CardContent className="p-6">
                  <m.icon className="w-5 h-5 text-gray-300 mb-2" />
                  <p className="text-xs font-black uppercase text-gray-400 tracking-widest">{m.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{m.value || 0}</p>
               </CardContent>
             </Card>
           ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 h-14">
            <TabsTrigger value="users" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
               <Users className="w-4 h-4 mr-2" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
               <FileText className="w-4 h-4 mr-2" /> Solicitações
            </TabsTrigger>
            <TabsTrigger value="metrics" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
               <BarChart3 className="w-4 h-4 mr-2" /> Métricas Avançadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="py-5 font-black text-gray-600 pl-8">Usuário</TableHead>
                    <TableHead className="py-5 font-black text-gray-600">Papel (Role)</TableHead>
                    <TableHead className="py-5 font-black text-gray-600">Status</TableHead>
                    <TableHead className="py-5 font-black text-gray-600">Cadastro</TableHead>
                    <TableHead className="py-5 font-black text-gray-600 text-right pr-8">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="py-5 font-bold pl-8">
                        <p>{u.name}</p>
                        <p className="text-xs text-gray-400 font-normal">{u.email}</p>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5">
                        {u.active ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-full px-3 py-1 border-0">Ativo</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full px-3 py-1 border-0">Bloqueado</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-5 text-sm font-semibold text-gray-500">
                        {format(new Date(u.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="py-5 text-right pr-8">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleUser(u.id, u.active)}
                          className={`rounded-xl font-bold ${u.active ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                        >
                          {u.active ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                          {u.active ? "Bloquear" : "Ativar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
             <Card className="rounded-[40px] border-0 shadow-xl bg-white p-10 flex flex-col items-center gap-6">
                <FileText className="w-12 h-12 text-gray-200" />
                <h3 className="text-xl font-black text-gray-800">Moderação de Solicitações</h3>
                <p className="text-center text-muted-foreground max-w-md">Para garantir a segurança, você pode remover qualquer postagem que infrinja os Termos de Uso ou contenha fraude.</p>
                <Table className="w-full mt-4">
                   <TableHeader className="bg-gray-50/50">
                      <TableRow>
                         <TableHead className="font-bold">Título</TableHead>
                         <TableHead className="font-bold">Autor</TableHead>
                         <TableHead className="font-bold">Status</TableHead>
                         <TableHead className="font-bold text-right">Ações</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {requests.map(r => (
                        <TableRow key={r.id}>
                           <TableCell className="py-4 font-bold max-w-[300px] truncate">{r.title}</TableCell>
                           <TableCell className="py-4 text-sm font-semibold text-gray-600">{r.author.name}</TableCell>
                           <TableCell className="py-4 text-right"><Badge variant="outline" className="rounded-full">{r.status}</Badge></TableCell>
                           <TableCell className="py-4 text-right">
                              <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 text-gray-600">
                                 <Link href={`/solicitacoes/${r.id}`}><ExternalLink className="w-4 h-4" /></Link>
                              </Button>
                           </TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </Card>
          </TabsContent>

          <TabsContent value="metrics">
             <Card className="rounded-[40px] border-0 shadow-xl bg-white p-20 flex flex-col items-center justify-center gap-6">
                <div className="bg-red-50 p-6 rounded-full">
                  <BarChart3 className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Métricas Expandidas em Breve</h2>
                <p className="text-muted-foreground font-semibold">Estamos preparando gráficos detalhados de retenção e crescimento orgânico.</p>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
