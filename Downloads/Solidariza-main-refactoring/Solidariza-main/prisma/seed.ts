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

    // 1. Create Users
    const donor = await prisma.user.upsert({
        where: { email: 'donor@example.com' },
        update: {},
        create: {
            email: 'donor@example.com',
            name: 'Doador Exemplo',
            password,
            role: 'doador',
            profileImage: 'https://i.pravatar.cc/150?u=donor',
            phoneNumber: '11999999999',
        },
    });

    const receiver = await prisma.user.upsert({
        where: { email: 'receiver@example.com' },
        update: {},
        create: {
            email: 'receiver@example.com',
            name: 'Receptor Exemplo',
            password,
            role: 'receptor',
            profileImage: 'https://i.pravatar.cc/150?u=receiver',
            phoneNumber: '11888888888',
            bio: 'Preciso de ajuda com alimentos.',
        },
    });

    const ong = await prisma.user.upsert({
        where: { email: 'ong@example.com' },
        update: {},
        create: {
            email: 'ong@example.com',
            name: 'ONG Solidária',
            password,
            role: 'instituicao',
            profileImage: 'https://i.pravatar.cc/150?u=ong',
            phoneNumber: '11777777777',
            bio: 'Ajudando quem precisa.',
        },
    });

    // 2. Create Help Requests
    await prisma.helpRequest.createMany({
        data: [
            {
                title: 'Cesta Básica Urgente',
                description: 'Estamos sem alimentos há 2 dias.',
                location: 'São Paulo, SP',
                items: JSON.stringify(['Arroz', 'Feijão', 'Óleo']),
                helpType: 'Alimentos',
                authorId: receiver.id,
                status: 'Pendente',
            },
            {
                title: 'Roupas de Frio',
                description: 'Roupas para crianças de 5 anos.',
                location: 'São Paulo, SP',
                items: JSON.stringify(['Casaco', 'Calça', 'Luvas']),
                helpType: 'Roupas',
                authorId: receiver.id,
                status: 'Concluído',
            },
            {
                title: 'Material Escolar',
                description: 'Cadernos e lápis para volta às aulas.',
                location: 'Osasco, SP',
                items: JSON.stringify(['Caderno', 'Lápis', 'Borracha']),
                helpType: 'Educação',
                authorId: receiver.id,
                status: 'Pendente',
            },
        ],
    });

    // 3. Create Conversation
    await prisma.conversation.create({
        data: {
            user1Id: donor.id,
            user2Id: receiver.id,
            lastMessage: 'Estou indo levar as doações.',
            messages: {
                create: [
                    {
                        senderId: donor.id,
                        receiverId: receiver.id,
                        message: 'Olá, vi seu pedido de cesta básica.',
                    },
                    {
                        senderId: receiver.id,
                        receiverId: donor.id,
                        message: 'Olá! Muito obrigado. Deus abençoe.',
                    },
                    {
                        senderId: donor.id,
                        receiverId: receiver.id,
                        message: 'Estou indo levar as doações.',
                    },
                ],
            },
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
