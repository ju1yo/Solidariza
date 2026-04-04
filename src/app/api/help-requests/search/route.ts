import { NextRequest } from "next/server";
import { HelpRequestService } from "@/core/services/help-request.service";
import { createHandler } from "@/lib/route-handler";

const helpRequestService = new HelpRequestService();


export const GET = createHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const helpType = searchParams.get("helpType") || undefined;
    const status = searchParams.get("status") || undefined;
    const location = searchParams.get("location") || undefined;

    return await helpRequestService.search(query, { helpType, status, location });
});
