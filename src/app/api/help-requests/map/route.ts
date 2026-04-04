import { NextRequest, NextResponse } from "next/server";
import { HelpRequestService } from "@/core/services/help-request.service";

const helpRequestService = new HelpRequestService();

export async function GET() {
  try {
    const mapData = await helpRequestService.getMapData();
    return NextResponse.json(mapData);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar dados do mapa" },
      { status: 500 }
    );
  }
}
