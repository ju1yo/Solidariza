import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as getMetrics } from '@/app/api/admin/metrics/route'
import { GET as getUsers } from '@/app/api/admin/users/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

vi.mock('next-auth')

describe('API Route: /api/admin/*', () => {
  let adminId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const user = await prisma.user.create({ data: { name: 'Admin', email: `a${Date.now()}@t.com`, password: 'p', role: 'usuario' } }) // Role verification is usually in the route
    adminId = user.id
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: adminId, role: 'admin' } })
  })

  it('should return system metrics', async () => {
    const res = await getMetrics()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.totalUsers).toBeDefined()
  })

  it('should list users for admin', async () => {
    // Note: Admin routes usually check role from session in the handler
    const res = await getUsers(new Request('http://localhost:3000/api/admin/users?page=1') as any)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.users).toBeDefined()
  })
})
