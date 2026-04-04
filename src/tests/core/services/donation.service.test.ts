import { describe, it, expect, beforeEach } from 'vitest'
import { DonationService } from '@/core/services/donation.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'

describe('DonationService', () => {
  let donationService: DonationService
  let donorId: string
  let authorId: string
  let helpRequestId: string

  beforeEach(async () => {
    donationService = new DonationService()

    const donor = await prisma.user.create({ data: { name: 'Donor', email: `d${Date.now()}@t.com`, password: 'p' } })
    donorId = donor.id

    const author = await prisma.user.create({ data: { name: 'Author', email: `a${Date.now()}@t.com`, password: 'p' } })
    authorId = author.id

    const helpReq = await prisma.helpRequest.create({
      data: { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId }
    })
    helpRequestId = helpReq.id
  })

  it('should offer help and notify author', async () => {
    const donation = await donationService.offer(donorId, helpRequestId, 'I can help')
    expect(donation.id).toBeDefined()
    expect(donation.status).toBe('oferecido')

    const notification = await prisma.notification.findFirst({
      where: { userId: authorId, type: 'donation_offer' }
    })
    expect(notification).not.toBeNull()
  })

  it('should not allow author to offer help to their own request', async () => {
    await expect(donationService.offer(authorId, helpRequestId)).rejects.toThrow(AppError)
  })

  it('should accept a donation offer', async () => {
    const donation = await donationService.offer(donorId, helpRequestId)
    await donationService.accept(donation.id, authorId)

    const updated = await prisma.donation.findUnique({ where: { id: donation.id } })
    expect(updated?.status).toBe('aceito')

    const notification = await prisma.notification.findFirst({
      where: { userId: donorId, type: 'donation_accepted' }
    })
    expect(notification).not.toBeNull()
  })

  it('should mark a donation as delivered', async () => {
    const donation = await donationService.offer(donorId, helpRequestId)
    await donationService.accept(donation.id, authorId)
    await donationService.markDelivered(donation.id, donorId)

    const updated = await prisma.donation.findUnique({ where: { id: donation.id } })
    expect(updated?.status).toBe('entregue')
  })

  it('should confirm completion and close help request', async () => {
    const donation = await donationService.offer(donorId, helpRequestId)
    await donationService.accept(donation.id, authorId)
    await donationService.markDelivered(donation.id, donorId)
    await donationService.confirm(donation.id, authorId)

    const updatedDonation = await prisma.donation.findUnique({ where: { id: donation.id } })
    expect(updatedDonation?.status).toBe('confirmado')

    const updatedRequest = await prisma.helpRequest.findUnique({ where: { id: helpRequestId } })
    expect(updatedRequest?.status).toBe('Concluído')
  })

  it('should cancel a donation offer', async () => {
    const donation = await donationService.offer(donorId, helpRequestId)
    await donationService.cancel(donation.id, donorId)

    const updated = await prisma.donation.findUnique({ where: { id: donation.id } })
    expect(updated?.status).toBe('cancelado')
  })

  it('should list donations by donor', async () => {
    await donationService.offer(donorId, helpRequestId)
    const list = await donationService.listByDonor(donorId)
    expect(list.length).toBe(1)
  })
})
