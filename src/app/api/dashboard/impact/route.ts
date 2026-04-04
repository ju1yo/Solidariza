import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "@/core/services/dashboard.service";

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const summary = await dashboardService.getImpactSummary();
    const monthly = await dashboardService.getMonthlyDonations();

    return NextResponse.json({ summary, monthly });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar métricas de impacto" },
      { status: 500 }
    );
  }
}
