import { describe, it, expect, beforeEach } from 'vitest'
import { DashboardService } from '@/core/services/dashboard.service'
import { prisma } from '@/lib/prisma'

describe('DashboardService', () => {
  let dashboardService: DashboardService
  let userId: string

  beforeEach(async () => {
    dashboardService = new DashboardService()
    const user = await prisma.user.create({ data: { name: 'Donor', email: `d${Date.now()}@t.com`, password: 'p', role: 'doador' } })
    userId = user.id
  })

  it('should get dashboard summary', async () => {
    await prisma.helpRequest.create({ data: { title: 'T1', status: 'Pendente', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    await prisma.helpRequest.create({ data: { title: 'T2', status: 'Concluído', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    
    const summary = await dashboardService.getSummary()
    expect(summary.totalOrders).toBe(2)
    expect(summary.pending).toBe(1)
    expect(summary.completed).toBe(1)
  })

  it('should get recent activities', async () => {
    await prisma.helpRequest.create({ data: { title: 'New Request', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    
    const activities = await dashboardService.getRecentActivities()
    expect(activities.length).toBeGreaterThan(0)
    expect(activities[0].type).toBe('request')
  })

  it('should get impact summary', async () => {
    const req = await prisma.helpRequest.create({ data: { title: 'T', status: 'Concluído', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    await prisma.donation.create({ data: { helpRequestId: req.id, donorId: userId, status: 'confirmado' } })

    const impact = await dashboardService.getImpactSummary()
    expect(impact.totalHelped).toBe(1)
    expect(impact.totalDonations).toBe(1)
    expect(impact.activeDonors).toBe(1)
  })

  it('should get top donors', async () => {
    const req = await prisma.helpRequest.create({ data: { title: 'T', status: 'Concluído', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    await prisma.donation.create({ data: { helpRequestId: req.id, donorId: userId, status: 'confirmado' } })

    const top = await dashboardService.getTopDonors()
    expect(top.length).toBe(1)
    expect(top[0].name).toBe('Donor')
    expect(top[0].donationsCount).toBe(1)
  })

  it('should get user badges', async () => {
    const req = await prisma.helpRequest.create({ data: { title: 'T', status: 'Concluído', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: userId } })
    await prisma.donation.create({ data: { helpRequestId: req.id, donorId: userId, status: 'confirmado' } })
    await prisma.rating.create({ data: { donationId: (await prisma.donation.findFirst())?.id!, raterId: (await prisma.user.create({data: {name:'Rater', email:'r@t.com', password:'p'}})).id, ratedId: userId, score: 5 } })

    const badges = await dashboardService.getUserBadges(userId)
    expect(badges.find(b => b.id === 'first_step')?.achieved).toBe(true)
    expect(badges.find(b => b.id === 'first_aid')?.achieved).toBe(true)
    expect(badges.find(b => b.id === 'five_stars')?.achieved).toBe(true)
  })

  it('should get monthly donations stats', async () => {
    const stats = await dashboardService.getMonthlyDonations()
    expect(stats.length).toBe(6) // Last 6 months
  })
})
