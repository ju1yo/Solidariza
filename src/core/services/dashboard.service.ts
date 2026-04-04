import { prisma } from "@/lib/prisma";

export class DashboardService {
  async getSummary() {
    const totalOrders = await prisma.helpRequest.count();
    const pending = await prisma.helpRequest.count({ where: { status: "Pendente" } });
    const completed = await prisma.helpRequest.count({ where: { status: "Concluído" } });

    return {
      totalOrders,
      pending,
      completed,
      lastUpdate: new Date(),
    };
  }

  async getRecentActivities() {
    const recentRequests = await prisma.helpRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const activities = [
      ...recentRequests.map((req) => ({
        id: req.id,
        text: `Novo pedido: ${req.title} por ${req.author.name}`,
        time: req.createdAt,
        type: "request",
      })),
      ...recentUsers.map((u) => ({
        id: u.id,
        text: `Novo usuário cadastrado: ${u.name}`,
        time: u.createdAt,
        type: "user",
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }

  async getPendingRequests() {
    const requests = await prisma.helpRequest.findMany({
      where: { status: "Pendente" },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        helpType: true,
        status: true,
        createdAt: true,
      },
    });

    return requests.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.helpType,
      status: r.status,
    }));
  }

  async getImpactSummary() {
    const totalHelped = await prisma.user.count({
      where: { helpRequests: { some: { status: "Concluído" } } },
    });

    const totalDonations = await prisma.donation.count({
      where: { status: "confirmado" },
    });

    const activeDonors = await prisma.user.count({
      where: { role: "doador", donations: { some: { status: "confirmado" } } },
    });

    return {
      totalHelped,
      totalDonations,
      activeDonors,
    };
  }

  async getMonthlyDonations() {
    // Get last 6 months data
    const lastMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("pt-BR", { month: "short" }),
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      };
    }).reverse();

    const stats = await Promise.all(
      lastMonths.map(async (m) => {
        const start = new Date(m.year, m.monthNum, 1);
        const end = new Date(m.year, m.monthNum + 1, 0);

        const count = await prisma.donation.count({
          where: {
            status: "confirmado",
            createdAt: { gte: start, lte: end },
          },
        });

        return { name: m.month, total: count };
      })
    );

    return stats;
  }

  async getTopDonors(limit = 5) {
    const donors = await prisma.user.findMany({
      where: { role: "doador" },
      take: limit,
      include: {
        _count: {
          select: { donations: { where: { status: "confirmado" } } },
        },
        ratingsReceived: {
          select: { score: true },
        },
      },
      orderBy: { donations: { _count: "desc" } },
    });

    return donors.map((d) => {
      const avgRating =
        d.ratingsReceived.length > 0
          ? d.ratingsReceived.reduce((acc, curr) => acc + curr.score, 0) /
            d.ratingsReceived.length
          : 5.0;

      return {
        id: d.id,
        name: d.name,
        profileImage: d.profileImage,
        donationsCount: d._count.donations,
        rating: avgRating,
      };
    });
  }

  async getUserBadges(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            donations: { where: { status: "confirmado" } },
            helpRequests: { where: { status: "Concluído" } },
            messagesSent: true,
          },
        },
        ratingsReceived: { select: { score: true } },
      },
    });

    if (!user) return [];

    const badges = [];

    // 🌱 Primeiro Passo
    badges.push({ id: "first_step", name: "Primeiro Passo", description: "Criação de conta", achieved: true });

    // 🤝 Primeira Ajuda
    const hasDonation = user._count.donations > 0;
    badges.push({ id: "first_aid", name: "Primeira Ajuda", description: "Primeira doação confirmada", achieved: hasDonation });

    // ⭐ Nota 5
    const hasFiveStars = user.ratingsReceived.some((r) => r.score === 5);
    badges.push({ id: "five_stars", name: "Nota 5", description: "Recebeu uma avaliação 5 estrelas", achieved: hasFiveStars });

    // 🏅 10 Doações
    const tenDonations = user._count.donations >= 10;
    badges.push({ id: "ten_donations", name: "10 Doações", description: "10 doações confirmadas", achieved: tenDonations });

    // 🏆 Herói da Comunidade
    const hero = user._count.donations >= 50;
    badges.push({ id: "hero", name: "Herói da Comunidade", description: "50 doações confirmadas", achieved: hero });

    return badges;
  }
}
