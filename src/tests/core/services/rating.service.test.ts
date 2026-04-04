import { describe, it, expect, beforeEach } from 'vitest'
import { RatingService } from '@/core/services/rating.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'

describe('RatingService', () => {
  let ratingService: RatingService
  let user1Id: string
  let user2Id: string
  let helpRequestId: string
  let donationId: string

  beforeEach(async () => {
    ratingService = new RatingService()

    // Database is cleared by setup.ts
    // Let's seed necessary entities for tests
    const user1 = await prisma.user.create({
      data: {
        name: 'Rater',
        email: 'rater@test.com',
        password: 'pass',
      }
    })
    user1Id = user1.id

    const user2 = await prisma.user.create({
      data: {
        name: 'Rated',
        email: 'rated@test.com',
        password: 'pass',
      }
    })
    user2Id = user2.id

    // Help Request created by user2 (Author = rated)
    const helpReq = await prisma.helpRequest.create({
      data: {
        title: 'Need food',
        description: 'Test',
        location: 'NYC',
        items: JSON.stringify([{name: 'Rice', quantity: 1}]),
        helpType: 'Alimentos',
        authorId: user2Id
      }
    })
    helpRequestId = helpReq.id

    // Donation made by user1 (Donor = rater)
    const donation = await prisma.donation.create({
      data: {
        helpRequestId: helpRequestId,
        donorId: user1Id,
        status: 'confirmado',
      }
    })
    donationId = donation.id
  })

  it('should create a rating successfully', async () => {
    const rating = await ratingService.create(user1Id, {
      donationId,
      score: 5,
      comment: 'Great!'
    })

    expect(rating).toBeDefined()
    expect(rating.score).toBe(5)
    expect(rating.raterId).toBe(user1Id)
    expect(rating.ratedId).toBe(user2Id)
  })

  it('should fail if donation does not exist', async () => {
    await expect(ratingService.create('fake-id', {
      donationId: 'fake-donation',
      score: 5,
      comment: 'Great!'
    })).rejects.toThrow(AppError)
  })

  it('should fail if donation is not confirmed', async () => {
    const unconfirmedDonation = await prisma.donation.create({
      data: {
        helpRequestId: helpRequestId,
        donorId: user1Id,
        status: 'oferecido',
      }
    })

    await expect(ratingService.create(user1Id, {
      donationId: unconfirmedDonation.id,
      score: 5,
      comment: 'Great!'
    })).rejects.toThrow("Apenas doações confirmadas podem ser avaliadas")
  })

  it('should fail if rater is not part of the donation', async () => {
    const thirdUser = await prisma.user.create({
      data: {
        name: 'Stranger',
        email: 'stranger@test.com',
        password: 'pass',
      }
    })

    await expect(ratingService.create(thirdUser.id, {
      donationId,
      score: 5,
      comment: 'Great!'
    })).rejects.toThrow("Não faz parte desta doação para avaliar")
  })

  it('should fail if rating already exists', async () => {
    await ratingService.create(user1Id, {
      donationId,
      score: 5,
      comment: 'Great!'
    })

    await expect(ratingService.create(user1Id, {
      donationId,
      score: 4,
      comment: 'Good!'
    })).rejects.toThrow("Você já avaliou esta doação")
  })

  it('should get ratings by donation', async () => {
    await ratingService.create(user1Id, {
      donationId,
      score: 5,
    })

    const ratings = await ratingService.getByDonation(donationId)
    expect(ratings.length).toBe(1)
    expect(ratings[0].score).toBe(5)
    expect(ratings[0].rater.name).toBe('Rater')
  })

  it('should get average rating for user', async () => {
    await ratingService.create(user1Id, {
      donationId,
      score: 4,
    })

    // create a second donation & rating to same user
    const user3 = await prisma.user.create({
      data: { name: 'Donor 3', email: 'd3@test.com', password: 'pass' }
    })
    const don2 = await prisma.donation.create({
      data: {
        helpRequestId,
        donorId: user3.id,
        status: 'confirmado'
      }
    })

    await ratingService.create(user3.id, {
      donationId: don2.id,
      score: 5,
    })

    const avg = await ratingService.getAverageForUser(user2Id)
    expect(avg.count).toBe(2)
    expect(avg.average).toBe(4.5)
  })

  it('should list all ratings for a user', async () => {
    await ratingService.create(user1Id, {
      donationId,
      score: 5,
      comment: 'Awesome'
    })

    const list = await ratingService.listByUser(user2Id)
    expect(list.length).toBe(1)
    expect(list[0].score).toBe(5)
    expect(list[0].rater.name).toBe('Rater')
  })
})
