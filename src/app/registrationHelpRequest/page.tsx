"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";

const ITENS_NECESSARIOS = [
  "Arroz", "Feijão", "Macarrão", "Açúcar", "Farinha de Trigo", "Óleo de Cozinha",
  "Leite Longa Vida", "Café", "Sal", "Enlatados (sardinha, milho, ervilha)",
  "Molho de Tomate", "Biscoitos / Bolachas", "Achocolatado", "Farinha Láctea",
  "Sabonete", "Shampoo", "Condicionador", "Pasta de Dente", "Escova de Dente",
  "Papel Higiênico", "Absorventes", "Desodorante", "Detergente", "Sabão em Barra",
  "Sabão em Pó", "Água Sanitária", "Desinfetante", "Esponja", "Panos de Limpeza",
  "Fraldas Infantis", "Leite em Pó", "Lenços Umedecidos", "Pomada para Assaduras",
  "Fraldas Geriátricas", "Protetores de Colchão", "Roupas Masculinas",
  "Roupas Femininas", "Roupas Infantis", "Agasalhos", "Cobertores", "Calçados",
  "Máscaras", "Álcool Gel", "Kits de Primeiros Socorros", "Ração para Animais",
];

const TIPOS_AJUDAS = [
  "Doação de Alimentos", "Doação de Itens de Higiene", "Doação de Itens de Limpeza",
  "Doação de Roupas", "Doação de Cobertores", "Doação de Materiais para Bebês",
  "Doação de Materiais para Idosos", "Doação de Ração para Animais",
  "Apoio como Voluntário", "Apoio em Distribuição de Cestas",
  "Transporte / Entrega de Doações", "Cadastro de Novos Pontos de Coleta",
  "Ajudar na Organização de Estoque", "Divulgação da Campanha",
  "Apoio em Eventos Solidários",
];

export default function RegistrationHelpRequestsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItemsDescription, setCustomItemsDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedHelpType, setSelectedHelpType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleItemToggle = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
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
    setError(null);

    if (!title || !description || !location || !selectedHelpType || (selectedItems.length === 0 && !customItemsDescription)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
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

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Falha no upload da imagem.");
        }
        imageUrl = uploadData.url;
      }
      const response = await fetch("/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          items: selectedItems,
          customItemsDescription,
          helpType: selectedHelpType,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar o pedido.");
      }

      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Cadastro de Solicitação de
              <span className="bg-gradient-to-r from-[#5DADE2] to-[#FF4C5B] bg-clip-text text-transparent"> Ajuda</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">Título do Pedido</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Ex: Doação de alimentos para família" />
              </div>
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-2">Descrição do Pedido</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Descreva a necessidade em detalhes"></textarea>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Foto do Pedido</label>
                <label htmlFor="imageUpload" className="relative cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-400 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Pré-visualização" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-cloud-arrow-up text-4xl"></i>
                      <p className="mt-2">Clique para inserir uma imagem</p>
                      <p className="text-xs text-gray-500">PNG e JPG</p>
                    </div>
                  )}
                </label>
                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Itens Necessários</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                  {ITENS_NECESSARIOS.map((item) => (
                    <label key={item} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={selectedItems.includes(item)} onChange={() => handleItemToggle(item)} className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500" />
                      <span className="text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="customItems" className="block text-lg font-semibold text-gray-700 mb-2">Sua opção não está na lista? Descreva-a abaixo.</label>
                <input type="text" id="customItems" value={customItemsDescription} onChange={(e) => setCustomItemsDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Descrição dos Itens" />
              </div>

              <div>
                <label htmlFor="location" className="block text-lg font-semibold text-gray-700 mb-2">Localização</label>
                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Cidade, Estado ou Bairro" />
              </div>

              {/* Tipo de Ajuda */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Tipo de Ajuda</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                  {TIPOS_AJUDAS.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="helpType" value={type} checked={selectedHelpType === type} onChange={(e) => setSelectedHelpType(e.target.value)} className="h-4 w-4 text-red-500 border-gray-300 focus:ring-red-500" />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Erro e Botões */}
              {error && <p className="text-red-500 text-center bg-red-100 p-3 rounded-md">{error}</p>}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-10 py-3 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition-colors">
                  Voltar
                </button>
                <button type="submit" disabled={loading} className="w-full sm:w-auto px-10 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition-colors disabled:bg-green-300">
                  {loading ? "Finalizando..." : "Finalizar Pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}