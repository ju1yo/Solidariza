import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/help-requests/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/help-requests', () => {
  let userId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const user = await prisma.user.create({ data: { name: 'Author', email: 'a@t.com', password: 'p' } })
    userId = user.id
  })

  it('should list help requests (GET)', async () => {
    await prisma.helpRequest.create({
      data: { title: 'R1', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId }
    })

    const response = await GET(new NextRequest('http://localhost:3000/api/help-requests'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.length).toBe(1)
    expect(data.data[0].title).toBe('R1')
  })

  it('should create a help request (POST) when authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: userId } })

    const body = {
      title: 'New API Request',
      description: 'Desc',
      location: 'NYC',
      items: '[]',
      helpType: 'Alimentos'
    }

    const req = new NextRequest('http://localhost:3000/api/help-requests', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.title).toBe(body.title)
    expect(data.data.authorId).toBe(userId)
  })

  it('should return 401 for POST when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const req = new NextRequest('http://localhost:3000/api/help-requests', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(req)
    expect(response.status).toBe(401)
  })
})
