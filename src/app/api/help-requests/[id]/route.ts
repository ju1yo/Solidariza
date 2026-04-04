import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HelpRequestService } from "@/core/services/help-request.service";

const helpRequestService = new HelpRequestService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const request = await helpRequestService.getById(params.id);
    return NextResponse.json(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar pedido" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { status } = await req.json();
    const updated = await helpRequestService.updateStatus(params.id, session.user.id, status);

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar pedido" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await helpRequestService.delete(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao excluir pedido" },
      { status: error.statusCode || 500 }
    );
  }
}
