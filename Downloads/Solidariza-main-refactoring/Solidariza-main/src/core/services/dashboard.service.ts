import { prisma } from "@/lib/prisma";

export class DashboardService {
    async getSummary() {
        const totalOrders = await prisma.helpRequest.count();
        const pending = await prisma.helpRequest.count({ where: { status: "Pendente" } }); // Assuming default or specific status
        const completed = await prisma.helpRequest.count({ where: { status: "Concluído" } }); // Needs to match DB values

        return {
            totalOrders,
            pending,
            completed,
            lastUpdate: new Date(),
        };
    }

    async getRecentActivities() {
        // Combine recent HelpRequests and Users as "activities"
        const recentRequests = await prisma.helpRequest.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { author: { select: { name: true } } },
        });

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        });

        // Map to a common structure
        const activities = [
            ...recentRequests.map(req => ({
                id: req.id,
                text: `Novo pedido: ${req.title} por ${req.author.name}`,
                time: req.createdAt,
                type: "request"
            })),
            ...recentUsers.map(u => ({
                id: u.id,
                text: `Novo usuário cadastrado: ${u.name}`,
                time: u.createdAt,
                type: "user"
            }))
        ];

        // Sort by time desc and take 5
        return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
    }

    async getPendingRequests() {
        const requests = await prisma.helpRequest.findMany({
            where: { status: "Pendente" }, // Ensure this matches typical status
            take: 10,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                helpType: true,
                status: true,
                createdAt: true
            }
        });

        // Map to match frontend expectations if necessary, or update frontend
        return requests.map(r => ({
            id: r.id, // ID is string (cuid), frontend interface says number. Frontend needs update.
            title: r.title,
            category: r.helpType,
            status: r.status
        }));
    }
}
