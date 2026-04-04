import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminService } from "@/core/services/admin.service";

const adminService = new AdminService();

async function checkAdmin(session: any) {
  return session?.user?.role === "admin" || session?.user?.role === "instituicao";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!await checkAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const metrics = await adminService.getSystemMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar métricas do sistema" },
      { status: 500 }
    );
  }
}
