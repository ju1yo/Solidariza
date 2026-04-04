"use client"

import React, { useState } from "react"
import { Star, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import toast from "react-hot-toast"

interface Props {
  donationId: string
  onSuccess?: () => void
}

export default function RatingForm({ donationId, onSuccess }: Props) {
  const [score, setScore] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (score === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId, score, comment }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao enviar avaliação")
      }

      toast.success("Avaliação enviada com sucesso! Obrigado por ajudar.")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="rounded-[35px] border-0 shadow-2xl shadow-yellow-100/50 bg-gradient-to-b from-white to-yellow-50/30 overflow-hidden ring-4 ring-white">
      <CardHeader className="text-center pb-2">
        <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-yellow-600 fill-current" />
        </div>
        <CardTitle className="text-2xl font-black text-gray-900">Como foi a experiência?</CardTitle>
        <p className="text-sm text-muted-foreground font-semibold">Sua avaliação ajuda a construir uma rede mais segura e confiável.</p>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`p-1 transition-all transform hover:scale-125 ${
                (hover || score) >= star ? "text-yellow-500" : "text-gray-200"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setScore(star)}
            >
              <Star 
                className={`w-10 h-10 ${ (hover || score) >= star ? "fill-current" : "" }`} 
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Comentário opcional</label>
          <Textarea 
            placeholder="Conte-nos um pouco sobre como foi o processo..." 
            className="rounded-3xl border-gray-100 bg-white min-h-[100px] p-4 text-sm resize-none focus:ring-yellow-400"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="p-8 pt-0">
        <Button 
          onClick={handleSubmit} 
          disabled={loading || score === 0}
          className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-100 text-white font-bold text-lg flex gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Avaliação</>}
        </Button>
      </CardFooter>
    </Card>
  )
}
