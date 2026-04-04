import { describe, it, expect, beforeEach } from 'vitest'
import { HelpRequestService } from '@/core/services/help-request.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'

describe('HelpRequestService', () => {
  let helpRequestService: HelpRequestService
  let userId: string

  beforeEach(async () => {
    helpRequestService = new HelpRequestService()
    const user = await prisma.user.create({ data: { name: 'U', email: `u${Date.now()}@t.com`, password: 'p' } })
    userId = user.id
  })

  it('should create a help request', async () => {
    const data = {
      title: 'Need food',
      description: 'Desc',
      location: 'Manaus',
      items: '[]',
      helpType: 'Alimentos',
      latitude: -3.1,
      longitude: -60.0
    }

    const req = await helpRequestService.create(userId, data)
    expect(req.id).toBeDefined()
    expect(req.title).toBe(data.title)
    expect(req.authorId).toBe(userId)
  })

  it('should list help requests', async () => {
    await helpRequestService.create(userId, { title: 'R1', description: 'D', location: 'L', items: '[]', helpType: 'T' })
    await helpRequestService.create(userId, { title: 'R2', description: 'D', location: 'L', items: '[]', helpType: 'T' })

    const list = await helpRequestService.list(10)
    expect(list.length).toBe(2)
  })

  it('should search help requests with filters', async () => {
    await helpRequestService.create(userId, { title: 'Searchable', description: 'D', location: 'Manaus', items: '[]', helpType: 'Alimentos' })
    
    let result = await helpRequestService.search('Searchable')
    expect(result.length).toBe(1)

    result = await helpRequestService.search(undefined, { helpType: 'Outro' })
    expect(result.length).toBe(0)

    result = await helpRequestService.search(undefined, { location: 'Manaus' })
    expect(result.length).toBe(1)
  })

  it('should get help request by id', async () => {
    const created = await helpRequestService.create(userId, { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T' })
    const found = await helpRequestService.getById(created.id)
    expect(found.title).toBe('T')
  })

  it('should update status if authorized', async () => {
    const created = await helpRequestService.create(userId, { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T' })
    await helpRequestService.updateStatus(created.id, userId, 'Concluído')
    
    const updated = await prisma.helpRequest.findUnique({ where: { id: created.id } })
    expect(updated?.status).toBe('Concluído')
  })

  it('should delete if authorized', async () => {
    const created = await helpRequestService.create(userId, { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T' })
    await helpRequestService.delete(created.id, userId)
    
    const found = await prisma.helpRequest.findUnique({ where: { id: created.id } })
    expect(found).toBeNull()
  })

  it('should get map data', async () => {
    await helpRequestService.create(userId, { title: 'Map', description: 'D', location: 'L', items: '[]', helpType: 'T', latitude: 1, longitude: 1 })
    const mapData = await helpRequestService.getMapData()
    expect(mapData.length).toBe(1)
    expect(mapData[0].title).toBe('Map')
  })
})
