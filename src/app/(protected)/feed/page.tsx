"use client"

import React, { useState } from "react"
import { useFeed } from "@/hooks/useFeed"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Tag, FilterX, MessageSquare, HandHeart, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import dynamic from "next/dynamic"
import { HELP_TYPES } from "@/core/constants/help-types"

const HelpRequestMap = dynamic(() => import("@/components/map/HelpRequestMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Carregando Mapa de Manaus...</p>
      </div>
    </div>
  )
})


export default function FeedPage() {
  const { requests, loading, filters, updateFilters, refresh } = useFeed()
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Feed de <span className="text-red-600">Solidariedade</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Encontre pessoas e causas que precisam do seu apoio hoje.
            </p>
          </div>
          
          <Button 
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            className="flex items-center gap-2 rounded-xl h-12 px-6 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <MapPin className="w-5 h-5" />
            {showMap ? "Ver Lista de Pedidos" : "Explorar no Mapa"}
          </Button>
        </div>

        {/* Filters Panel */}
        <Card className="rounded-2xl shadow-sm border-gray-200 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Query */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  className="pl-10 h-11 border-gray-200 rounded-xl bg-white"
                  value={filters.q}
                  onChange={(e) => updateFilters({ q: e.target.value })}
                />
              </div>

              {/* Type Filter */}
              <Select 
                value={filters.helpType} 
                onValueChange={(v) => updateFilters({ helpType: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-500" />
                    <SelectValue placeholder="Categoria de Ajuda" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {HELP_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cidade ou Bairro..."
                  className="pl-10 h-11 border-gray-200 rounded-xl bg-white"
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                />
              </div>

              {/* Reset/Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-xl h-11 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  onClick={() => updateFilters({ q: "", helpType: "", location: "", status: "" })}
                >
                  <FilterX className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="font-medium text-gray-500">Buscando as melhores causas...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-20 flex flex-col items-center justify-center border-dashed border-2 rounded-3xl bg-transparent">
            <div className="bg-red-100 p-6 rounded-full mb-4">
              <Search className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Não encontramos resultados para os filtros selecionados. Tente ajustar sua busca ou limpar os filtros.
            </p>
          </Card>
        ) : showMap ? (
           <div className="animate-in fade-in zoom-in duration-500">
              <HelpRequestMap markers={requests} />
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((req) => (
              <Card key={req.id} className="group overflow-hidden rounded-3xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={req.imageUrl || "/illustration-help-card.png"}
                    alt={req.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-white/90 text-red-700 backdrop-blur-md border-0 py-1.5 px-3 rounded-full font-bold shadow-sm">
                    {req.helpType}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8 ring-2 ring-red-100">
                      <AvatarImage src={req.authorImage || ""} />
                      <AvatarFallback className="bg-red-50 text-red-700 text-xs font-bold">
                        {req.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{req.authorName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        há {formatDistanceToNow(new Date(req.createdAt), { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-extrabold leading-tight text-gray-800 line-clamp-2">
                    {req.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {req.location}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex gap-2 p-4">
                  <Button asChild variant="secondary" className="flex-1 rounded-2xl h-11 font-bold bg-gray-100 hover:bg-gray-200">
                    <Link href={`/solicitacoes/${req.id}`}>
                      Detalhes
                    </Link>
                  </Button>
                  <Button asChild className="flex-2 rounded-2xl h-11 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                    <Link href={`/solicitacoes/${req.id}?action=help`}>
                      <HandHeart className="w-4 h-4 mr-2" />
                      Quero Ajudar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
