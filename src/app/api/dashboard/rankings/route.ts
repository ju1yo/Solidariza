import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "@/core/services/dashboard.service";

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const topDonors = await dashboardService.getTopDonors();
    return NextResponse.json(topDonors);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar ranking de doadores" },
      { status: 500 }
    );
  }
}
