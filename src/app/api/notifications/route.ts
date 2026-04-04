import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/core/services/notification.service";

const notificationService = new NotificationService();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const notifications = await notificationService.list(session.user.id);
    const unreadCount = await notificationService.countUnread(session.user.id);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar notificações" },
      { status: 500 }
    );
  }
}
