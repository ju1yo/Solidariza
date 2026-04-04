import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    if (!process.env.PASSWORD_DEFAULT) {
        throw new Error('PASSWORD_DEFAULT not found in environment variables');
    }

    const password = process.env.PASSWORD_DEFAULT;
    const hashedPassword = await hash(password, 10);

    // ── Users ──
    const admin = await prisma.user.upsert({
        where: { email: 'admin@solidariza.com' },
        update: {},
        create: {
            email: 'admin@solidariza.com',
            name: 'Administrador',
            password: hashedPassword,
            role: 'admin',
            profileImage: 'https://i.pravatar.cc/150?u=admin',
        },
    });

    const donor = await prisma.user.upsert({
        where: { email: 'donor@example.com' },
        update: {},
        create: {
            email: 'donor@example.com',
            name: 'Maria Silva',
            password: hashedPassword,
            role: 'doador',
            profileImage: 'https://i.pravatar.cc/150?u=donor',
            phoneNumber: '11999999999',
            bio: 'Doadora ativa, ajudando quem precisa.',
        },
    });

    const donor2 = await prisma.user.upsert({
        where: { email: 'donor2@example.com' },
        update: {},
        create: {
            email: 'donor2@example.com',
            name: 'Carlos Oliveira',
            password: hashedPassword,
            role: 'doador',
            profileImage: 'https://i.pravatar.cc/150?u=donor2',
            phoneNumber: '11988888888',
            bio: 'Sempre disposto a ajudar.',
        },
    });

    const receiver = await prisma.user.upsert({
        where: { email: 'receiver@example.com' },
        update: {},
        create: {
            email: 'receiver@example.com',
            name: 'João Santos',
            password: hashedPassword,
            role: 'receptor',
            profileImage: 'https://i.pravatar.cc/150?u=receiver',
            phoneNumber: '11977777777',
            bio: 'Preciso de ajuda com alimentos para minha familia.',
        },
    });

    const receiver2 = await prisma.user.upsert({
        where: { email: 'receiver2@example.com' },
        update: {},
        create: {
            email: 'receiver2@example.com',
            name: 'Ana Clara Souza',
            password: hashedPassword,
            role: 'receptor',
            profileImage: 'https://i.pravatar.cc/150?u=receiver2',
            phoneNumber: '11966666666',
            bio: 'Mãe solo procurando apoio.',
        },
    });

    const ong = await prisma.user.upsert({
        where: { email: 'ong@example.com' },
        update: {},
        create: {
            email: 'ong@example.com',
            name: 'ONG Solidária',
            password: hashedPassword,
            role: 'instituicao',
            profileImage: 'https://i.pravatar.cc/150?u=ong',
            phoneNumber: '11955555555',
            bio: 'Ajudando quem precisa desde 2020.',
        },
    });

    console.log('Users seeded:', [admin, donor, donor2, receiver, receiver2, ong].map(u => u.email));

    // ── Help Requests ──
    const helpReq1 = await prisma.helpRequest.create({
        data: {
            title: 'Doação de alimentos para família de 5 pessoas',
            description: 'Família com 3 crianças pequenas precisa de cesta básica urgente. Estamos passando por um momento difícil após perder o emprego.',
            location: 'Manaus, AM - Zona Norte',
            latitude: -3.0730,
            longitude: -60.0217,
            items: JSON.stringify(['Arroz', 'Feijão', 'Macarrão', 'Leite Longa Vida', 'Óleo de Cozinha']),
            helpType: 'Doação de Alimentos',
            authorId: receiver.id,
            status: 'Pendente',
        },
    });

    const helpReq2 = await prisma.helpRequest.create({
        data: {
            title: 'Roupas infantis para bebê de 6 meses',
            description: 'Preciso de roupas para meu bebê que está crescendo muito rápido. Tamanhos P e M.',
            location: 'Manaus, AM - Zona Sul',
            latitude: -3.1190,
            longitude: -60.0217,
            items: JSON.stringify(['Roupas Infantis', 'Fraldas Infantis', 'Lenços Umedecidos']),
            helpType: 'Doação de Roupas',
            authorId: receiver2.id,
            status: 'Pendente',
        },
    });

    const helpReq3 = await prisma.helpRequest.create({
        data: {
            title: 'Cobertores para abrigo comunitário',
            description: 'Noites frias se aproximam e precisamos de cobertores para o abrigo que atende 30 pessoas em situação de rua.',
            location: 'Manaus, AM - Centro',
            latitude: -3.1190,
            longitude: -60.0253,
            items: JSON.stringify(['Cobertores', 'Agasalhos', 'Roupas Masculinas', 'Roupas Femininas']),
            helpType: 'Doação de Cobertores',
            authorId: ong.id,
            status: 'Em Andamento',
        },
    });

    const helpReq4 = await prisma.helpRequest.create({
        data: {
            title: 'Material de higiene para comunidade',
            description: 'Comunidade ribeirinha precisa de itens básicos de higiene pessoal para 15 famílias.',
            location: 'Manaus, AM - Zona Leste',
            latitude: -3.0830,
            longitude: -59.9517,
            items: JSON.stringify(['Sabonete', 'Pasta de Dente', 'Shampoo', 'Papel Higiênico']),
            helpType: 'Doação de Itens de Higiene',
            authorId: ong.id,
            status: 'Pendente',
        },
    });

    const helpReq5 = await prisma.helpRequest.create({
        data: {
            title: 'Ração para animais resgatados',
            description: 'Resgatamos 8 cães de rua e precisamos de ração urgente para alimentá-los enquanto buscamos lares.',
            location: 'Manaus, AM - Zona Oeste',
            latitude: -3.1050,
            longitude: -60.0650,
            items: JSON.stringify(['Ração para Animais']),
            helpType: 'Doação de Ração para Animais',
            authorId: receiver.id,
            status: 'Concluído',
        },
    });

    console.log('Help requests seeded:', [helpReq1, helpReq2, helpReq3, helpReq4, helpReq5].map(h => h.title));

    // ── Donations ──
    const donation1 = await prisma.donation.create({
        data: {
            helpRequestId: helpReq3.id,
            donorId: donor.id,
            status: 'aceito',
            message: 'Tenho 10 cobertores novos para doar!',
        },
    });

    const donation2 = await prisma.donation.create({
        data: {
            helpRequestId: helpReq5.id,
            donorId: donor.id,
            status: 'confirmado',
            message: 'Doei 20kg de ração premium.',
        },
    });

    const donation3 = await prisma.donation.create({
        data: {
            helpRequestId: helpReq1.id,
            donorId: donor2.id,
            status: 'oferecido',
            message: 'Posso ajudar com uma cesta básica completa.',
        },
    });

    const donation4 = await prisma.donation.create({
        data: {
            helpRequestId: helpReq3.id,
            donorId: donor2.id,
            status: 'oferecido',
            message: 'Tenho 5 agasalhos de inverno para doar.',
        },
    });

    console.log('Donations seeded:', 4);

    // ── Rating ──
    await prisma.rating.create({
        data: {
            donationId: donation2.id,
            raterId: receiver.id,
            ratedId: donor.id,
            score: 5,
            comment: 'Doação excelente! A ração era de ótima qualidade.',
        },
    });

    console.log('Ratings seeded:', 1);

    // ── Comments ──
    await prisma.comment.createMany({
        data: [
            { helpRequestId: helpReq1.id, authorId: donor.id, content: 'Que situação difícil. Vou ver como posso ajudar!' },
            { helpRequestId: helpReq1.id, authorId: donor2.id, content: 'Posso contribuir com alguns itens. Entrando em contato!' },
            { helpRequestId: helpReq3.id, authorId: donor.id, content: 'Ótima iniciativa! Vou mobilizar mais pessoas.' },
            { helpRequestId: helpReq4.id, authorId: donor2.id, content: 'Trabalho em uma farmácia e consigo doação de produtos.' },
        ],
    });

    console.log('Comments seeded:', 4);

    // ── Notifications ──
    await prisma.notification.createMany({
        data: [
            { userId: receiver.id, type: 'donation_offer', title: 'Nova oferta de ajuda!', body: 'Carlos ofereceu ajuda no seu pedido "Doação de alimentos"', link: `/solicitacoes/${helpReq1.id}`, read: false },
            { userId: donor.id, type: 'donation_accepted', title: 'Oferta aceita!', body: 'Sua oferta de cobertores foi aceita pela ONG Solidária', link: `/solicitacoes/${helpReq3.id}`, read: true },
            { userId: receiver.id, type: 'new_comment', title: 'Novo comentário', body: 'Maria comentou no seu pedido de alimentos', link: `/solicitacoes/${helpReq1.id}`, read: false },
            { userId: donor.id, type: 'donation_completed', title: 'Doação confirmada!', body: 'João confirmou o recebimento da ração. Obrigado!', link: `/solicitacoes/${helpReq5.id}`, read: true },
            { userId: ong.id, type: 'donation_offer', title: 'Nova oferta!', body: 'Maria quer doar cobertores para o abrigo.', link: `/solicitacoes/${helpReq3.id}`, read: false },
            { userId: receiver2.id, type: 'new_comment', title: 'Apoio recebido', body: 'Alguém comentou em seu pedido de roupas infantis.', link: `/solicitacoes/${helpReq2.id}`, read: false },
        ],
    });

    console.log('Notifications seeded:', 6);

    // ── Conversations + Messages ──
    const conv = await prisma.conversation.create({
        data: {
            user1Id: donor.id,
            user2Id: receiver.id,
            lastMessage: 'Combinado! Entregarei amanhã.',
        },
    });

    await prisma.message.createMany({
        data: [
            { conversationId: conv.id, senderId: donor.id, receiverId: receiver.id, message: 'Olá! Vi seu pedido de alimentos. Como posso ajudar?' },
            { conversationId: conv.id, senderId: receiver.id, receiverId: donor.id, message: 'Oi Maria! Que bom saber! Precisamos muito de arroz e feijão.' },
            { conversationId: conv.id, senderId: donor.id, receiverId: receiver.id, message: 'Combinado! Entregarei amanhã.' },
        ],
    });

    console.log('Conversations + Messages seeded.');

    console.log('\n✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
