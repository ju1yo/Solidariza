"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SummaryData {
  totalOrders: number;
  pending: number;
  completed: number;
  lastUpdate: string;
}

interface Activity {
  id: string;
  text: string;
  time: string;
  type?: string;
}

interface RequestItem {
  id: string;
  title: string;
  category: string;
  status: string;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSummary(data);
      })
      .catch((err) => console.error("Error fetching summary:", err));

    fetch("/api/dashboard/activities")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch((err) => console.error("Error fetching activities:", err));

    fetch("/api/dashboard/requests")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);

  const formattedLastUpdate = summary?.lastUpdate
    ? formatDistanceToNow(new Date(summary.lastUpdate), {
        addSuffix: true,
        locale: ptBR,
      })
    : "—";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <Card className="bg-blue-400 border-0 text-white shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <img src="/card-pedidos.png" alt="pedidos" className="w-12 h-12" />
              <div>
                <p className="text-sm font-semibold opacity-90">Total de pedidos</p>
                <p className="text-3xl font-extrabold">{summary?.totalOrders ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-400 border-0 text-white shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <img src="/card-pendentes.png" alt="pendentes" className="w-12 h-12" />
              <div>
                <p className="text-sm font-semibold opacity-90">Pendentes</p>
                <p className="text-3xl font-extrabold">{summary?.pending ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500 border-0 text-white shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <img src="/card-concluidos.png" alt="concluidos" className="w-12 h-12" />
              <div>
                <p className="text-sm font-semibold opacity-90">Concluídos</p>
                <p className="text-3xl font-extrabold">{summary?.completed ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500 border-0 text-white shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <img src="/card-atualizacao.png" alt="atualização" className="w-12 h-12" />
              <div>
                <p className="text-sm font-semibold opacity-90">Última atualização</p>
                <p className="text-lg font-extrabold">{formattedLastUpdate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="especial-gradient text-[40px] mb-4">
            Atividades <span className="especial-gradient">recentes</span>
          </h2>

          <Card className="rounded-[30px] shadow-xl">
            <CardContent className="p-8">
              {activities.length === 0 && (
                <p className="text-muted-foreground py-6 text-center">
                  Nenhuma atividade recente
                </p>
              )}
              {activities.map((a, index) => (
                <div
                  key={a.id}
                  className={`flex items-center justify-between py-6 ${
                    index !== activities.length - 1
                      ? "border-b border-black/10"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <img src="/verified-icon.png" alt="verificado" />
                    <span className="font-bold">{a.text}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(a.time), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Open Requests Table */}
        <div>
          <h2 className="especial-gradient text-[40px] mb-4">
            Pedidos <span className="especial-gradient">em aberto</span>
          </h2>

          <Card className="rounded-[30px] shadow-xl">
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="font-bold text-gray-700 text-lg">
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Nenhum pedido em aberto
                      </TableCell>
                    </TableRow>
                  )}
                  {requests.map((req) => (
                    <TableRow key={req.id} className="font-semibold">
                      <TableCell>{req.title}</TableCell>
                      <TableCell>{req.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
