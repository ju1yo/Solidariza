import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/core/services/notification.service";

const notificationService = new NotificationService();

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id, all } = await req.json();

    if (all) {
      await notificationService.markAllAsRead(session.user.id);
    } else if (id) {
      await notificationService.markAsRead(id, session.user.id);
    } else {
      return NextResponse.json({ error: "ID ou 'all' deve ser fornecido" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao marcar como lida" },
      { status: 500 }
    );
  }
}
