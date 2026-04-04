import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/chat/messages/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/chat/messages', () => {
  let user1Id: string
  let user2Id: string
  let conversationId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const u1 = await prisma.user.create({ data: { name: 'U1', email: `u1${Date.now()}@t.com`, password: 'p' } })
    user1Id = u1.id
    const u2 = await prisma.user.create({ data: { name: 'U2', email: `u2${Date.now()}@t.com`, password: 'p' } })
    user2Id = u2.id
    const conv = await prisma.conversation.create({ data: { user1Id, user2Id } })
    conversationId = conv.id
  })

  it('should send a message (POST)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user1Id } })

    const req = new NextRequest('http://localhost:3000/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId: user2Id, content: 'Hello' })
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message.message).toBe('Hello')
  })

  it('should list messages (GET)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user1Id } })
    await prisma.message.create({
      data: { conversationId, senderId: user1Id, receiverId: user2Id, message: 'Existing' }
    })

    const req = new NextRequest(`http://localhost:3000/api/chat/messages?conversationId=${conversationId}`)
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.length).toBe(1)
  })

  it('should return 400 if conversationId is missing in GET', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user1Id } })
    const req = new NextRequest(`http://localhost:3000/api/chat/messages`)
    const response = await GET(req)
    expect(response.status).toBe(400)
  })
})
