import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/chat/conversations/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/chat/conversations', () => {
  let user1Id: string
  let user2Id: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const u1 = await prisma.user.create({ data: { name: 'U1', email: `u1${Date.now()}@t.com`, password: 'p' } })
    user1Id = u1.id
    const u2 = await prisma.user.create({ data: { name: 'U2', email: `u2${Date.now()}@t.com`, password: 'p' } })
    user2Id = u2.id
  })

  it('should list conversations (GET)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user1Id } })
    await prisma.conversation.create({ data: { user1Id, user2Id } })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.length).toBe(1)
  })

  it('should start a conversation (POST)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user1Id } })

    const req = new NextRequest('http://localhost:3000/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ receiverId: user2Id })
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBeDefined()
  })
})
