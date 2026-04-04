import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DonationService } from "@/core/services/donation.service";

const donationService = new DonationService();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const donation = await donationService.confirm(params.id, session.user.id);
    return NextResponse.json(donation);
  } catch (error: any) {
    console.error("Erro ao confirmar doação:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao confirmar doação" },
      { status: error.statusCode || 500 }
    );
  }
}
