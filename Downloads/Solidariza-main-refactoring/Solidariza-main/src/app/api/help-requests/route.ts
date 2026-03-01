import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HelpRequestService } from "@/core/services/help-request.service";
import { createHelpRequestSchema } from "@/core/dtos/help-request.dto";
import { z } from "zod";
import { AppError } from "@/core/domain/errors/domain.error";

const helpRequestService = new HelpRequestService();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Checking session here or let Service handle it? 
  // Service throws AppError if userId is missing, so we just need to pass ID. 
  // But safer to check session existence here for 401.
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. Validation
    const data = createHelpRequestSchema.parse(body);

    // 2. Service Call
    const helpRequest = await helpRequestService.create(session.user.id, data);

    return NextResponse.json(helpRequest, { status: 201 });
  } catch (error) {
    console.error("Erro na API de HelpRequest:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}