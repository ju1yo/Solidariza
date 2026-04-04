"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, 
  Eye, 
  Pencil, 
  Trash2, 
  Search, 
  Calendar, 
  Tag, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import toast from "react-hot-toast"

interface UserRequest {
  id: string
  title: string
  helpType: string
  status: string
  createdAt: string
  _count?: {
    donations: number
    comments: number
  }
}

export default function MyRequestsPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/dashboard/requests")
      if (!res.ok) throw new Error("Erro ao buscar solicitações")
      const data = await res.json()
      setRequests(data)
    } catch (err) {
      toast.error("Não foi possível carregar suas solicitações.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) fetchRequests()
  }, [session])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return

    try {
      const res = await fetch(`/api/help-requests/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir")
      toast.success("Pedido excluído com sucesso")
      setRequests(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      toast.error("Erro ao excluir pedido.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1.5 font-bold"><Clock className="w-3 h-3" /> {status}</Badge>
      case "Em Andamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 font-bold"><Loader2 className="w-3 h-3 animate-spin" /> {status}</Badge>
      case "Concluído":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 font-bold"><CheckCircle2 className="w-3 h-3" /> {status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              Minhas <span className="text-red-600">Solicitações</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o progresso dos seus pedidos de ajuda.
            </p>
          </div>
          
          <Button asChild className="rounded-xl h-12 px-6 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 font-bold">
            <Link href="/registrationHelpRequest">
              <PlusCircle className="w-5 h-5 mr-2" />
              Novo Pedido
            </Link>
          </Button>
        </div>

        {/* Content */}
        <Card className="rounded-3xl shadow-md border-0 bg-white overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Resumo das Solicitações</CardTitle>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-bold rounded-lg px-3">
                {requests.length} total
              </Badge>
            </div>
            <CardDescription>
              Gerencie suas postagens e interaja com doadores interessados.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Carregando seus dados...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Você ainda não tem pedidos</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                  Comece agora criando sua primeira solicitação para receber apoio da comunidade.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-xl border-red-200 text-red-700 hover:bg-red-50">
                  <Link href="/registrationHelpRequest">Criar agora</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50/80">
                  <TableRow className="border-b hover:bg-transparent">
                    <TableHead className="py-4 font-bold text-gray-700 pl-8">Título</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700">Categoria</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700">Status</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700">Data de Criação</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700 text-center">Doações</TableHead>
                    <TableHead className="py-4 font-bold text-gray-700 text-right pr-8">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} className="group hover:bg-gray-50/50 transition-colors">
                      <TableCell className="py-5 font-extrabold text-gray-800 pl-8 max-w-[250px] truncate">
                        {req.title}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Tag className="w-3.5 h-3.5 text-red-500" />
                          {req.helpType}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        {getStatusBadge(req.status)}
                      </TableCell>
                      <TableCell className="py-5 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {req.createdAt && !isNaN(new Date(req.createdAt).getTime()) 
                            ? format(new Date(req.createdAt), "dd/MM/yyyy", { locale: ptBR })
                            : "Data indisponível"}
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg px-2.5 font-bold">
                           {req._count?.donations || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 text-gray-600" title="Ver detalhes">
                            <Link href={`/solicitacoes/${req.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-red-50 text-red-600" title="Excluir pedido" onClick={() => handleDelete(req.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
