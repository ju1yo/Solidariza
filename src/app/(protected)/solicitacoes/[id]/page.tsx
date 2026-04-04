"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin, 
  Calendar, 
  Tag, 
  HandHeart, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Loader2, 
  Trash2, 
  Check, 
  X, 
  PackageCheck, 
  Send 
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import toast from "react-hot-toast"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    profileImage: string | null
  }
}

interface Donation {
  id: string
  donorId: string
  status: string
  message: string | null
  createdAt: string
  donor: {
    id: string
    name: string
    profileImage: string | null
  }
}

interface RequestDetail {
  id: string
  title: string
  description: string
  location: string
  items: any
  customItemsDescription: string | null
  helpType: string
  imageUrl: string | null
  status: string
  createdAt: string
  authorId: string
  author: {
    id: string
    name: string
    profileImage: string | null
    email: string
    phoneNumber: string | null
  }
  comments: Comment[]
  donations: Donation[]
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [offerText, setOfferText] = useState("")
  const [submittingOffer, setSubmittingOffer] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(searchParams.get("action") === "help")

  const isAuthor = session?.user?.id === request?.authorId
  const hasOffered = request?.donations.some(d => d.donorId === session?.user?.id)

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/help-requests/${id}`)
      if (!res.ok) throw new Error("Erro ao buscar detalhes")
      const data = await res.json()
      setRequest(data)
    } catch (err) {
      toast.error("Não foi possível carregar os detalhes do pedido.")
      router.push("/feed")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      setSubmittingComment(true)
      const res = await fetch(`/api/help-requests/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      })
      if (!res.ok) throw new Error("Erro ao comentar")
      
      const newComment = await res.json()
      setRequest(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null)
      setCommentText("")
      toast.success("Comentário publicado!")
    } catch (err) {
      toast.error("Erro ao publicar comentário.")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleOfferHelp = async () => {
    if (!offerText.trim()) {
      toast.error("Por favor, descreva como pode ajudar.")
      return
    }

    try {
      setSubmittingOffer(true)
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpRequestId: id, message: offerText }),
      })
      if (!res.ok) throw new Error("Erro ao oferecer ajuda")
      
      const newDonation = await res.json()
      setRequest(prev => prev ? { ...prev, donations: [newDonation, ...prev.donations] } : null)
      setShowOfferForm(false)
      toast.success("Oferta enviada com sucesso!")
    } catch (err) {
      toast.error("Erro ao enviar oferta.")
    } finally {
      setSubmittingOffer(false)
    }
  }

  const handleUpdateDonation = async (donationId: string, status: string) => {
    try {
      const res = await fetch(`/api/donations/${donationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Erro ao atualizar")
      
      toast.success(status === "aceito" ? "Oferta aceita!" : "Status atualizado")
      fetchDetail()
    } catch (err) {
      toast.error("Erro ao atualizar doação.")
    }
  }

  const handleConfirmReceipt = async (donationId: string) => {
    try {
      const res = await fetch(`/api/donations/${donationId}/confirm`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Erro ao confirmar")
      
      toast.success("Recebimento confirmado! Pedido concluído.")
      fetchDetail()
    } catch (err) {
      toast.error("Erro ao confirmar recebimento.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 gap-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <p className="font-bold text-gray-500">Carregando detalhes do pedido...</p>
      </div>
    )
  }

  if (!request) return null

  const itemsList = typeof request.items === "string" ? JSON.parse(request.items) : request.items

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation */}
        <Button asChild variant="ghost" className="hover:bg-gray-200 rounded-xl px-4">
          <Link href="/feed">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Feed
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[40px] shadow-xl border-0 overflow-hidden bg-white">
              <div className="relative h-72 md:h-96">
                <img 
                  src={request.imageUrl || "/illustration-help-card.png"} 
                  alt={request.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6">
                  <Badge variant="outline" className="bg-white/90 text-red-700 backdrop-blur-md border-0 py-2 px-4 rounded-full font-extrabold text-sm shadow-lg">
                    {request.helpType}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Clock className="w-4 h-4" />
                    Criado em {format(new Date(request.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  {request.status === "Pendente" ? (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-bold px-4 py-1.5 rounded-full border-0 shadow-sm">
                      Pendente
                    </Badge>
                  ) : request.status === "Em Andamento" ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold px-4 py-1.5 rounded-full border-0 shadow-sm animate-pulse">
                      Em Andamento
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold px-4 py-1.5 rounded-full border-0 shadow-sm">
                      Concluído
                    </Badge>
                  ) }
                </div>
                <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {request.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-4 text-gray-600 font-bold">
                  <MapPin className="w-5 h-5 text-red-500" />
                  {request.location}
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Separator className="w-12 bg-red-200" />
                    Descrição
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                {itemsList && itemsList.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <Separator className="w-12 bg-red-200" />
                      Itens Necessários
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {itemsList.map((item: string) => (
                        <div key={item} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100">
                          <CheckCircle2 className="w-5 h-5 text-red-500" />
                          <span className="font-bold text-gray-700">{item}</span>
                        </div>
                      ))}
                      {request.customItemsDescription && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100 md:col-span-2">
                          <Tag className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="font-bold text-gray-700">Outras necessidades:</p>
                            <p className="text-gray-600 text-sm mt-1">{request.customItemsDescription}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Offer Section for Authors */}
                {isAuthor && request.donations.length > 0 && (
                  <div className="pt-8">
                    <h3 className="text-2xl font-extrabold mb-6 text-gray-900 flex items-center gap-3">
                      <HandHeart className="w-7 h-7 text-red-600" />
                      Ofertas de Ajuda ({request.donations.filter(d => d.status !== 'cancelado').length})
                    </h3>
                    <div className="space-y-4">
                      {request.donations.filter(d => d.status !== 'cancelado').map((donation) => (
                        <Card key={donation.id} className="rounded-3xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-5 flex flex-col md:flex-row items-center gap-5">
                            <Avatar className="w-14 h-14 ring-4 ring-gray-50 font-bold">
                              <AvatarImage src={donation.donor.profileImage || ""} />
                              <AvatarFallback className="bg-red-100 text-red-700">
                                {donation.donor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center md:text-left">
                              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                <p className="font-extrabold text-gray-900">{donation.donor.name}</p>
                                <Badge variant="secondary" className="w-fit mx-auto md:mx-0 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">
                                  {donation.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 italic">&quot;{donation.message}&quot;</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                              {donation.status === "oferecido" && (
                                <>
                                  <Button size="sm" onClick={() => handleUpdateDonation(donation.id, "aceito")} className="flex-1 rounded-full bg-green-600 hover:bg-green-700 font-bold">
                                    <Check className="w-4 h-4 mr-1.5" /> Aceitar
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleUpdateDonation(donation.id, "cancelado")} className="flex-1 rounded-full text-red-600 hover:bg-red-50 font-bold">
                                    <X className="w-4 h-4 mr-1.5" /> Recusar
                                  </Button>
                                </>
                              )}
                              {donation.status === "entregue" && (
                                <Button size="sm" onClick={() => handleConfirmReceipt(donation.id)} className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 font-bold">
                                  <PackageCheck className="w-4 h-4 mr-1.5" /> Confirmar Recebimento
                                </Button>
                              )}
                              {donation.status === "confirmado" && (
                                <div className="text-green-600 font-bold flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5" /> Concluído
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="rounded-[40px] shadow-xl border-0 bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  Comentários ({request.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="space-y-6">
                  {request.comments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic">
                      Seja o primeiro a comentar neste pedido.
                    </div>
                  ) : (
                    request.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="w-10 h-10 shrink-0 font-bold">
                          <AvatarImage src={comment.author.profileImage || ""} />
                          <AvatarFallback className="bg-blue-50 text-blue-700">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-50 p-4 rounded-3xl rounded-tl-none">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-gray-900 text-sm">{comment.author.name}</p>
                            <span className="text-[10px] text-gray-400">
                              {formatDistanceToNow(new Date(comment.createdAt), { locale: ptBR, addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4">
                  <form onSubmit={handlePostComment} className="flex gap-3">
                    <Input 
                      placeholder="Escreva uma mensagem de apoio ou dúvida..." 
                      className="rounded-2xl h-14 bg-gray-50 border-gray-100 flex-1 px-6 shadow-inner"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      disabled={submittingComment || !commentText.trim()} 
                      className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 shrink-0"
                    >
                      {submittingComment ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-[40px] shadow-xl border-0 overflow-hidden bg-white">
              <CardHeader className="bg-gray-50 p-6 text-center border-b">
                <Avatar className="w-20 h-20 mx-auto shadow-xl ring-4 ring-white mb-4">
                  <AvatarImage src={request.author.profileImage || ""} />
                  <AvatarFallback className="text-xl font-bold bg-white text-red-600">
                    {request.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-extrabold text-gray-900">{request.author.name}</CardTitle>
                <CardDescription className="text-gray-500 font-semibold italic mt-1">Receptor de Ajuda</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Contato Seguro</p>
                  <div className="space-y-3 font-semibold text-gray-700 text-sm">
                    <p className="flex items-center gap-2"><Separator className="w-4" /> {request.author.email}</p>
                    {request.author.phoneNumber && (
                      <p className="flex items-center gap-2"><Separator className="w-4" /> {request.author.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {!isAuthor && request.status === "Pendente" && (
                  <div className="pt-4">
                    {showOfferForm ? (
                      <div className="space-y-4 p-4 bg-red-50 rounded-3xl border border-red-100">
                        <p className="text-sm font-bold text-red-800">Como você pode ajudar?</p>
                        <Textarea 
                          placeholder="Ex: Tenho 2 cestas básicas e posso entregar no domingo." 
                          className="rounded-2xl border-red-200 resize-none min-h-[100px] text-sm bg-white"
                          value={offerText}
                          onChange={(e) => setOfferText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleOfferHelp} disabled={submittingOffer} className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 font-bold">
                            {submittingOffer ? <Loader2 className="animate-spin" /> : "Enviar"}
                          </Button>
                          <Button variant="ghost" onClick={() => setShowOfferForm(false)} className="rounded-2xl text-gray-500 font-bold">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        disabled={hasOffered} 
                        onClick={() => setShowOfferForm(true)} 
                        className="w-full h-16 rounded-[25px] bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 text-lg font-bold"
                      >
                        {hasOffered ? (
                          <span className="flex items-center gap-2"><Check className="w-5 h-5"/> Oferta Enviada</span>
                        ) : (
                          <span className="flex items-center gap-2"><HandHeart className="w-6 h-6"/> Quero Ajudar</span>
                        )}
                      </Button>
                    )}
                  </div>
                )}
                
                {hasOffered && !isAuthor && (
                   <p className="text-xs text-center text-muted-foreground mt-4 italic">
                    Você já fez uma oferta de ajuda. <br/>Acompanhe as respostas em notificações.
                   </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[30px] border-dashed border-2 border-gray-200 bg-transparent p-6">
              <h4 className="font-bold text-gray-700 mb-2">Dica de Segurança</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Priorize entregas em locais públicos e bem iluminados. Nunca compartilhe senhas ou dados bancários durante as conversas.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDistanceToNow(date: Date, options: any) {
  // Simplified replacement since external import might fail in some envs
  const diffInMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
}
