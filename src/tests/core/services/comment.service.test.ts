import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommentService } from '@/core/services/comment.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'

describe('CommentService', () => {
  let commentService: CommentService
  let user1Id: string
  let user2Id: string
  let helpRequestId: string

  beforeEach(async () => {
    commentService = new CommentService()

    const user1 = await prisma.user.create({ data: { name: 'U1', email: 'u1@test.com', password: 'p' } })
    user1Id = user1.id

    const user2 = await prisma.user.create({ data: { name: 'U2', email: 'u2@test.com', password: 'p' } })
    user2Id = user2.id

    const helpReq = await prisma.helpRequest.create({
      data: { title: 'T', description: 'D', location: 'L', items: '[]', helpType: 'T', authorId: user2Id }
    })
    helpRequestId = helpReq.id
  })

  it('should create a comment and notify the author', async () => {
    const comment = await commentService.create(user1Id, helpRequestId, 'Informative comment')
    expect(comment.id).toBeDefined()
    expect(comment.content).toBe('Informative comment')

    // Check if notification was created for user2
    const notification = await prisma.notification.findFirst({
      where: { userId: user2Id, type: 'new_comment' }
    })
    expect(notification).not.toBeNull()
  })

  it('should not notify the author if they comment on their own request', async () => {
    await commentService.create(user2Id, helpRequestId, 'Self comment')
    const notification = await prisma.notification.findFirst({
      where: { userId: user2Id, type: 'new_comment' }
    })
    expect(notification).toBeNull()
  })

  it('should list comments for a help request', async () => {
    await commentService.create(user1Id, helpRequestId, 'C1')
    await commentService.create(user1Id, helpRequestId, 'C2')

    const list = await commentService.listByHelpRequest(helpRequestId)
    expect(list.length).toBe(2)
  })

  it('should delete a comment if authorized', async () => {
    const comment = await commentService.create(user1Id, helpRequestId, 'To be deleted')
    await commentService.delete(comment.id, user1Id)

    const count = await prisma.comment.count()
    expect(count).toBe(0)
  })

  it('should fail delete if not authorized', async () => {
    const comment = await commentService.create(user1Id, helpRequestId, 'Not your comment')
    await expect(commentService.delete(comment.id, user2Id)).rejects.toThrow(AppError)
  })

  it('should fail if help request does not exist', async () => {
    await expect(commentService.create(user1Id, 'fake-id', 'test')).rejects.toThrow(AppError)
  })
})
