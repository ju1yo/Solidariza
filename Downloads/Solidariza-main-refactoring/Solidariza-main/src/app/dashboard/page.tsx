"use client";

import React, { useEffect, useState } from "react";

interface SummaryData {
  totalOrders: number;
  pending: number;
  completed: number;
  lastUpdate: string;
}

interface Activity {
  id: string; // Changed from number to string (CUID)
  text: string;
  time: string;
  type?: string;
}

interface RequestItem {
  id: string; // Changed from number to string (CUID)
  title: string;
  category: string;
  status: string;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    // 1. Fetch Summary
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSummary(data);
      })
      .catch((err) => console.error("Error fetching summary:", err));

    // 2. Fetch Activities
    fetch("/api/dashboard/activities")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch((err) => console.error("Error fetching activities:", err));

    // 3. Fetch Requests
    fetch("/api/dashboard/requests")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch((err) => console.error("Error fetching requests:", err));
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
          <Card title="Total de pedidos" value={summary?.totalOrders} color="bg-blue-400" icon={<img src="/card-pedidos.png" />} />
          <Card title="Pendentes" value={summary?.pending} color="bg-red-400" icon={<img src="/card-pendentes.png" />} />
          <Card title="Concluídos" value={summary?.completed} color="bg-green-500" icon={<img src="/card-concluidos.png" />} />
          <Card title="Última atualização" value="há 1 hora" color="bg-purple-500" icon={<img src="/card-atualizacao.png" />} />
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
              className={`flex items-center justify-between py-6 ${index !== activities.length - 1 ? "border-b border-black/30" : ""
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
                  className={`font-bold ${index !== requests.length - 1 ? "border-b border-black/30" : ""
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
