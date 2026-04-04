import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/donations/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth')

describe('API Route: /api/donations', () => {
  let donorId: string
  let authorId: string
  let helpRequestId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const donor = await prisma.user.create({ data: { name: 'Donor', email: `d${Date.now()}@t.com`, password: 'p' } })
    donorId = donor.id

    const author = await prisma.user.create({ data: { name: 'Author', email: `a${Date.now()}@t.com`, password: 'p' } })
    authorId = author.id

    const helpReq = await prisma.helpRequest.create({
      data: { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId }
    })
    helpRequestId = helpReq.id
  })

  it('should offer help (POST)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: donorId } })

    const body = { helpRequestId, message: 'I can help' }
    const req = new NextRequest('http://localhost:3000/api/donations', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.helpRequestId).toBe(helpRequestId)
  })

  it('should list donations by donor (GET)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: donorId } })
    
    await prisma.donation.create({ data: { helpRequestId, donorId, status: 'oferecido' } })

    const req = new NextRequest('http://localhost:3000/api/donations')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.length).toBe(1)
  })

  it('should return 401 if unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new NextRequest('http://localhost:3000/api/donations', { method: 'POST' })
    const response = await POST(req)
    expect(response.status).toBe(401)
  })
})
