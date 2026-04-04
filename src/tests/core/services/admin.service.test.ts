import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AdminService } from '@/core/services/admin.service'
import { prisma } from '@/lib/prisma'

describe('AdminService', () => {
  let adminService: AdminService

  beforeEach(async () => {
    adminService = new AdminService()
  })

  it('should list users with pagination and search', async () => {
    // Create some users
    await prisma.user.create({ data: { name: 'Admin User', email: 'admin@test.com', password: 'p' } })
    await prisma.user.create({ data: { name: 'Search Me', email: 'search@test.com', password: 'p' } })

    const result = await adminService.listUsers(1, 10, 'Search')
    expect(result.total).toBe(1)
    expect(result.users[0].name).toBe('Search Me')
  })

  it('should toggle user active status', async () => {
    const user = await prisma.user.create({ data: { name: 'U1', email: 'u1@test.com', password: 'p' } })
    const updated = await adminService.toggleUserActive(user.id, false)
    expect(updated.active).toBe(false)
  })

  it('should list help requests with pagination', async () => {
    const user = await prisma.user.create({ data: { name: 'U1', email: 'u1@test.com', password: 'p' } })
    await prisma.helpRequest.create({
      data: {
        title: 'Req 1',
        description: 'D',
        location: 'L',
        items: '[]',
        helpType: 'T',
        authorId: user.id
      }
    })

    const result = await adminService.listAllRequests(1, 10)
    expect(result.total).toBe(1)
    expect(result.requests[0].title).toBe('Req 1')
  })

  it('should delete a request', async () => {
    const user = await prisma.user.create({ data: { name: 'U1', email: 'u1@test.com', password: 'p' } })
    const req = await prisma.helpRequest.create({
      data: { title: 'R', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: user.id }
    })

    await adminService.deleteRequest(req.id)
    const count = await prisma.helpRequest.count()
    expect(count).toBe(0)
  })

  it('should get system metrics', async () => {
    const user = await prisma.user.create({ data: { name: 'U', email: 'u@test.com', password: 'p' } })
    await prisma.helpRequest.create({
      data: { title: 'R', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: user.id }
    })
    
    const metrics = await adminService.getSystemMetrics()
    expect(metrics.totalUsers).toBe(1)
    expect(metrics.totalRequests).toBe(1)
  })
})
