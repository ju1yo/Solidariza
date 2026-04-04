import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DonationService } from "@/core/services/donation.service";
import { createDonationSchema } from "@/core/dtos/donation.dto";

const donationService = new DonationService();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createDonationSchema.parse(body);

    const donation = await donationService.offer(
      session.user.id,
      validatedData.helpRequestId,
      validatedData.message
    );

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API de doações:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar doação" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const donorId = searchParams.get("donorId") || session.user.id;
    const helpRequestId = searchParams.get("helpRequestId");

    if (helpRequestId) {
      const donations = await donationService.listByHelpRequest(helpRequestId);
      return NextResponse.json(donations);
    }

    const donations = await donationService.listByDonor(donorId);
    return NextResponse.json(donations);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar doações" },
      { status: 500 }
    );
  }
}
