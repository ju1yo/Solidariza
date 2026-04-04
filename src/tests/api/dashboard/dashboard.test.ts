import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as getSummary } from '@/app/api/dashboard/summary/route'
import { GET as getActivities } from '@/app/api/dashboard/activities/route'
import { GET as getImpact } from '@/app/api/dashboard/impact/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

vi.mock('next-auth')

describe('API Route: /api/dashboard/*', () => {
  let userId: string

  beforeEach(async () => {
    vi.clearAllMocks()
    const user = await prisma.user.create({ data: { name: 'D', email: `d${Date.now()}@t.com`, password: 'p' } })
    userId = user.id
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: userId } })
  })

  it('should return dashboard summary', async () => {
    const res = await getSummary()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.totalOrders).toBeDefined()
  })

  it('should return recent activities', async () => {
    const res = await getActivities()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('should return impact summary', async () => {
    const res = await getImpact()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.summary.totalHelped).toBeDefined()
    expect(Array.isArray(data.monthly)).toBe(true)
  })
})
