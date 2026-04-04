import { describe, it, expect, beforeEach } from 'vitest'
import { ChatService } from '@/core/services/chat.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'

describe('ChatService', () => {
  let chatService: ChatService
  let user1Id: string
  let user2Id: string

  beforeEach(async () => {
    chatService = new ChatService()

    const user1 = await prisma.user.create({ data: { name: 'U1', email: 'u1@test.com', password: 'p' } })
    user1Id = user1.id

    const user2 = await prisma.user.create({ data: { name: 'U2', email: 'u2@test.com', password: 'p' } })
    user2Id = user2.id
  })

  it('should start a conversation between two users', async () => {
    const conv = await chatService.startConversation(user1Id, user2Id)
    expect(conv.id).toBeDefined()
    expect(conv.user1Id).toBe(user1Id)
    expect(conv.user2Id).toBe(user2Id)
  })

  it('should send a message and create conversation if not exists', async () => {
    const result = await chatService.sendMessage(user1Id, {
      receiverId: user2Id,
      content: 'Hello!'
    })

    expect(result.conversation).toBeDefined()
    expect(result.message.message).toBe('Hello!')
    expect(result.message.senderId).toBe(user1Id)
    expect(result.message.receiverId).toBe(user2Id)
  })

  it('should reuse existing conversation when sending message', async () => {
    await chatService.startConversation(user1Id, user2Id)
    const result = await chatService.sendMessage(user1Id, {
      receiverId: user2Id,
      content: 'Second message'
    })

    const conversations = await prisma.conversation.count()
    expect(conversations).toBe(1)
    expect(result.conversation.lastMessage).toBe('Second message')
  })

  it('should get conversations for a user with unread count', async () => {
    await chatService.sendMessage(user1Id, { receiverId: user2Id, content: 'Hey' })
    
    const convs = await chatService.getConversations(user2Id)
    expect(convs.length).toBe(1)
    expect(convs[0].unreadCount).toBe(1)
    expect(convs[0].otherUser.id).toBe(user1Id)
  })

  it('should get messages for a conversation', async () => {
    const { conversation } = await chatService.sendMessage(user1Id, { receiverId: user2Id, content: 'M1' })
    await chatService.sendMessage(user1Id, { receiverId: user2Id, content: 'M2' })

    const messages = await chatService.getMessages(user1Id, conversation.id)
    expect(messages.length).toBe(2)
    expect(messages[0].message).toBe('M1')
    expect(messages[1].message).toBe('M2')
  })

  it('should fail if user is not part of the conversation', async () => {
    const { conversation } = await chatService.sendMessage(user1Id, { receiverId: user2Id, content: 'Hello' })
    
    const thirdUser = await prisma.user.create({ data: { name: 'U3', email: 'u3@test.com', password: 'p' } })

    await expect(chatService.getMessages(thirdUser.id, conversation.id)).rejects.toThrow(AppError)
  })
})
