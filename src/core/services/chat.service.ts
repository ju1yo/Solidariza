import { prisma } from "@/lib/prisma";
import { SendMessageDTO } from "../dtos/chat.dto";
import { AppError } from "../domain/errors/domain.error";

export class ChatService {
    async getConversations(userId: string) {
        if (!userId) throw new AppError("Usuário não identificado", 401);

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId },
                ],
            },
            include: {
                user1: {
                    select: { id: true, name: true, profileImage: true },
                },
                user2: {
                    select: { id: true, name: true, profileImage: true },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return conversations.map(conv => ({
            id: conv.id,
            lastMessage: conv.lastMessage,
            updatedAt: conv.updatedAt,
            otherUser: conv.user1Id === userId ? conv.user2 : conv.user1,
            unreadCount: conv.messages.filter(m => !m.read && m.receiverId === userId).length,
        }));
    }

    async getMessages(userId: string, conversationId: string) {
        if (!conversationId) throw new AppError("ID da conversa é obrigatório", 400);

        // Verify if user is part of the conversation (security)
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
            throw new AppError("Conversa não encontrada ou acesso negado", 404);
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: { name: true, profileImage: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return messages.map(msg => ({
            id: msg.id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            message: msg.message,
            read: msg.read,
            createdAt: msg.createdAt,
            senderName: msg.sender.name,
            senderPhoto: msg.sender.profileImage,
        }));
    }

    async sendMessage(senderId: string, data: SendMessageDTO) {
        if (!senderId) throw new AppError("Usuário não identificado", 401);

        // Find or create conversation
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: data.receiverId },
                    { user1Id: data.receiverId, user2Id: senderId },
                ],
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    user1Id: senderId,
                    user2Id: data.receiverId,
                    lastMessage: data.content,
                },
            });
        } else {
            conversation = await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessage: data.content,
                    updatedAt: new Date(),
                },
            });
        }

        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: senderId,
                receiverId: data.receiverId,
                message: data.content,
            },
            include: {
                sender: {
                    select: { name: true, profileImage: true },
                },
            },
        });

        return {
            conversation,
            message: {
                ...message,
                senderName: message.sender.name,
                senderPhoto: message.sender.profileImage,
            },
        };
    }

    async startConversation(userId: string, receiverId: string) {
        if (!receiverId) throw new AppError("Receiver ID missing", 400);

        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: userId },
                ],
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    user1Id: userId,
                    user2Id: receiverId,
                },
            });
        }
        return conversation;
    }
}
