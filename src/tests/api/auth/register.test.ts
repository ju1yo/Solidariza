import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'

describe('API Route: /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const body = {
      name: 'API User',
      email: 'api@test.com',
      password: 'password123',
      role: 'usuario'
    }

    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.user.email).toBe(body.email)
    
    const dbUser = await prisma.user.findUnique({ where: { email: body.email } })
    expect(dbUser).not.toBeNull()
  })

  it('should return 400 for invalid data', async () => {
    const body = { email: 'invalid' }
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('should return 409 if user already exists', async () => {
    await prisma.user.create({ data: { name: 'E', email: 'e@t.com', password: 'password123' } })

    const body = { name: 'E', email: 'e@t.com', password: 'password123', role: 'usuario' }
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const response = await POST(req)
    expect(response.status).toBe(409)
  })
})
