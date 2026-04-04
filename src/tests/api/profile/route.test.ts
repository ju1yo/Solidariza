import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT } from '@/app/api/profile/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/profile', () => {
  let userId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const user = await prisma.user.create({ data: { name: 'Profile User', email: `p${Date.now()}@t.com`, password: 'password123' } })
    userId = user.id
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: userId } })
  })

  it('should get profile (GET)', async () => {
    const res = await GET()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.name).toBe('Profile User')
  })

  it('should update profile (PUT)', async () => {
    const body = { name: 'Updated Name', bio: 'New bio' }
    const req = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      body: JSON.stringify(body)
    })

    const res = await PUT(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.name).toBe('Updated Name')
  })
})
