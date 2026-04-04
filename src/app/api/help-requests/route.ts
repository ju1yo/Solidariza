import { createHandler } from "@/lib/route-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HelpRequestService } from "@/core/services/help-request.service";
import { createHelpRequestSchema } from "@/core/dtos/help-request.dto";
import { AppError } from "@/core/domain/errors/domain.error";

const helpRequestService = new HelpRequestService();

// GET — list help requests (public)
export const GET = createHandler(async () => {
  return await helpRequestService.list(12);
});

// POST — create help request (auth required)
export const POST = createHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new AppError("Não autorizado", 401, "UNAUTHORIZED");
  }

  const body = await req.json();

  // 1. Validation
  const data = createHelpRequestSchema.parse(body);

  // 2. Service Call
  return await helpRequestService.create(session.user.id, data);
});