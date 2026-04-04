"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlusCircle, 
  MapPin, 
  Image as ImageIcon, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Info,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/hooks/use-api";

const ITENS_NECESSARIOS = [
  "Arroz", "Feijão", "Macarrão", "Açúcar", "Farinha de Trigo", "Óleo de Cozinha",
  "Leite Longa Vida", "Café", "Sal", "Enlatados",
  "Molho de Tomate", "Biscoitos", "Achocolatado", "Farinha Láctea",
  "Sabonete", "Shampoo", "Pasta de Dente", "Escova de Dente",
  "Papel Higiênico", "Absorventes", "Desodorante", "Detergente",
  "Sabão em Pó", "Água Sanitária", "Desinfetante", "Esponja",
  "Fraldas Infantis", "Leite em Pó", "Fraldas Geriátricas", "Roupas",
  "Agasalhos", "Cobertores", "Calçados", "Ração para Animais",
];

import { HELP_TYPES } from "@/core/constants/help-types";

export default function RegistrationHelpRequestsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItemsDescription, setCustomItemsDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedHelpType, setSelectedHelpType] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleItemToggle = (item: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, item] : prev.filter((i) => i !== item)
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !selectedHelpType) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        }
      }

      // Default Manaus coordinates for now or try to prompt user
      const manausCoords = { lat: -3.1190275, lng: -60.0217314 };

      const responseData = await apiFetch("/api/help-requests", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          location,
          items: selectedItems,
          customItemsDescription,
          helpType: selectedHelpType,
          imageUrl,
          latitude: manausCoords.lat + (Math.random() - 0.5) * 0.05,
          longitude: manausCoords.lng + (Math.random() - 0.5) * 0.05,
        }),
      });

      if (responseData) {
        toast.success("Pedido criado com sucesso! Ele já está visível no feed.");
        router.push("/solicitacoes");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
           <Button variant="ghost" onClick={() => router.back()} className="rounded-xl hover:bg-gray-200">
             <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
           </Button>
           <div className="text-right">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Nova <span className="text-red-600">Solicitação</span>
              </h1>
              <p className="text-muted-foreground font-semibold italic text-sm">Preencha os detalhes para receber apoio.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-[40px] border-0 shadow-xl bg-white p-8 space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">O que você precisa? (Título)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Alimentos para família de 4 pessoas"
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 font-bold text-gray-800 focus:ring-red-500 shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Conte sua história e explique como a ajuda será utilizada..."
                    className="rounded-3xl border-gray-100 bg-gray-50/50 p-6 font-medium text-gray-800 focus:ring-red-500 shadow-inner resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                      <Tag className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900">Itens Específicos</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ITENS_NECESSARIOS.slice(0, 16).map((item) => (
                    <label 
                      key={item} 
                      htmlFor={`item-${item}`}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        id={`item-${item}`}
                        checked={selectedItems.includes(item)}
                        className="rounded-lg border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        onCheckedChange={(checked) =>
                          handleItemToggle(item, checked === true)
                        }
                      />
                      <span className="text-sm font-bold text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-2">
                  <Label htmlFor="customItems" className="text-xs font-bold text-gray-400 ml-1">Outros itens não listados</Label>
                  <Input
                    id="customItems"
                    value={customItemsDescription}
                    onChange={(e) => setCustomItemsDescription(e.target.value)}
                    placeholder="Descreva aqui..."
                    className="h-12 rounded-xl mt-2 border-gray-100 bg-gray-50/50"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="rounded-[40px] border-0 shadow-xl bg-white overflow-hidden">
               <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><MapPin className="w-4 h-4" /></div>
                  <h3 className="font-black text-gray-900">Localização</h3>
               </div>
               <CardContent className="p-6 space-y-4">
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bairro, Manaus - AM"
                    className="h-14 rounded-2xl border-gray-100 bg-white px-5 font-bold shadow-sm"
                  />
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                     <Info className="w-5 h-5 text-blue-600 shrink-0" />
                     <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                       Sua localização exata não será mostrada publicamente por segurança. Apenas o bairro.
                     </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-[40px] border-0 shadow-xl bg-white overflow-hidden">
               <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600"><ImageIcon className="w-4 h-4" /></div>
                  <h3 className="font-black text-gray-900">Foto</h3>
               </div>
               <CardContent className="p-6">
                  <label htmlFor="imageUpload" className="cursor-pointer group">
                    <div className="h-48 rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-all relative overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center space-y-2">
                           <PlusCircle className="w-10 h-10 text-gray-300 mx-auto group-hover:text-red-400 transition-colors" />
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Adicionar Foto</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
               </CardContent>
            </Card>

            <Card className="rounded-[40px] border-0 shadow-xl bg-white overflow-hidden">
               <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><CheckCircle2 className="w-4 h-4" /></div>
                  <h3 className="font-black text-gray-900">Categoria</h3>
               </div>
                <CardContent className="p-6 grid grid-cols-1 gap-2">
                  {HELP_TYPES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={selectedHelpType === type ? "default" : "secondary"}
                      onClick={() => setSelectedHelpType(type)}
                      className={`h-12 rounded-xl text-sm font-bold flex items-center justify-start px-4 transition-all ${
                        selectedHelpType === type 
                        ? "bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
               </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-20 rounded-[30px] bg-red-600 hover:bg-red-700 text-xl font-black text-white shadow-2xl shadow-red-950/30 gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> Publicar Pedido</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}