"use client";

import React, { useEffect, useState } from "react";

interface SummaryData {
  totalOrders: number;
  pending: number;
  completed: number;
  lastUpdate: string;
}

interface Activity {
  id: number;
  text: string;
  time: string;
}

interface RequestItem {
  id: number;
  title: string;
  category: string;
  status: string;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {

    //Chamar api, banco de dados e preencher os states
    // fetch("/api/summary").then(res => res.json()).then(data => setSummary(data))
    setSummary({
      totalOrders: 10,
      pending: 2,
      completed: 3,
      lastUpdate: "2025-11-22T12:00:00",
    });

    //trazer as atividades do banco
    // fetch("/api/activities").then(r => r.json()).then(data => setActivities(data))

    setActivities([
      { id: 1, text: "Você doou R$ 50,00 para o usuario: userexample", time: "2025-11-22T11:00:00" },
      { id: 2, text: "O pedido 1 foi concluído com todos os itens", time: "2025-11-21T10:00:00" },
      { id: 3, text: "Pedido 2 aprovado", time: "2025-11-20T09:00:00" },
      { id: 4, text: "Você recebeu uma mensagem de user@example", time: "2025-11-19T08:00:00" },
    ]);

    //carregar os pedidos do banco
    // fetch("/api/requests").then(r => r.json()).then(data => setRequests(data))

    setRequests([
      { id: 1, title: "Ajuda com cesta básica", category: "Alimentos", status: "Pendente" },
      { id: 2, title: "Pagamento de contas", category: "Financeiro", status: "Pendente" },
      { id: 3, title: "Reforma de moradia", category: "Construção", status: "Pendente" },
    ]);

  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto rounded-lg shadow-lg p-6">

        {/* Cards Superiores */}
        {/* 
          Esses cards usam o "summary" que vem do banco.
          Quando trocar o setSummary, os valores dos cards mudam automaticamente.
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-12 font-bold">
          <Card title="Total de pedidos" value={summary?.totalOrders} color="bg-blue-400" icon={<img src="/card-pedidos.png"/>} />
          <Card title="Pendentes" value={summary?.pending} color="bg-red-400" icon={<img src="/card-pendentes.png"/>} />
          <Card title="Concluídos" value={summary?.completed} color="bg-green-500" icon={<img src="/card-concluidos.png"/>} />
          <Card title="Última atualização" value="há 1 hora" color="bg-purple-500" icon={<img src="/card-atualizacao.png"/>} />
        </div>

        {/* Atividades Recentes */}
        <h2 className="especial-gradient text-[40px]">
          Atividades <span className="especial-gradient">recentes</span>
        </h2>

        {/* 
          Aqui está exibindo o conteúdo do banco vindo de "activities"
        */}
        <div className="bg-white p-12 rounded-[30px] font-bold shadow-xl mb-6">
          {activities.map((a, index) => (
            <div
              key={a.id}
              className={`flex items-center justify-between py-6 ${
                index !== activities.length - 1 ? "border-b border-black/30" : ""
              }`}
            >
              <div className="flex items-center gap-5">
                <img src="/verified-icon.png" alt="verificado" />
                <span>{a.text}</span>
              </div>
              <button>
                <img src="/eye-icon.png" alt="ver" />
              </button>
            </div>
          ))}
        </div>

        {/* Tabela de Pedidos */}
        <h2 className="especial-gradient text-[40px]">
          Pedidos <span className="especial-gradient">em aberto</span>
        </h2>

        {/* 
          Aqui lista do banco -> "requests"
        */}
        <div className="bg-white p-4 rounded-[30px] shadow-xl overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="font-bold text-gray-700 border-b border-black/30 text-[30px]">
                <th className="py-3">Título</th>
                <th className="py-3">Categoria</th>
                <th className="py-3">Status</th>
                <th className="py-3">Ver</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req.id}
                  className={`font-bold ${
                    index !== requests.length - 1 ? "border-b border-black/30" : ""
                  }`}
                >
                  <td className="py-3">{req.title}</td>
                  <td className="py-3">{req.category}</td>
                  <td className="py-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {req.status}
                    </span>
                  </td>
                  <td className="py-6">
                    <button>
                      <img src="/eye-icon.png" alt="ver" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: any;
  color: string;
  icon: React.ReactNode;
}

function Card({ title, value, color, icon }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl shadow text-white flex items-center gap-2 ${color}`}>
      <div>
        {icon}
      </div>
      <div>
        <div className="text-[20px] font-bold">{title}</div>
        <div className="text-[30px] font-extrabold mt-2">{value}</div>
      </div>
    </div>
  );
}
