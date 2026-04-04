import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/notifications/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/notifications', () => {
  let userId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const user = await prisma.user.create({ data: { name: 'N', email: `n${Date.now()}@t.com`, password: 'p' } })
    userId = user.id
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: userId } })
  })

  it('should list user notifications (GET)', async () => {
    await prisma.notification.create({
      data: { userId, type: 'info', title: 'T', body: 'B' }
    })

    const res = await GET(new NextRequest('http://localhost:3000/api/notifications'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.notifications.length).toBe(1)
    expect(data.unreadCount).toBe(1)
  })

  it('should return 401 if unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const res = await GET(new NextRequest('http://localhost:3000/api/notifications'))
    expect(res.status).toBe(401)
  })
})
