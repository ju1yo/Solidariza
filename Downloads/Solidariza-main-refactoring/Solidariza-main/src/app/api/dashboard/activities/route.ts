import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardService } from "@/core/services/dashboard.service";

const dashboardService = new DashboardService();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await dashboardService.getRecentActivities();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Dashboard Activities Error:", error);
        return NextResponse.json({ error: "Erro ao buscar atividades" }, { status: 500 });
    }
}
