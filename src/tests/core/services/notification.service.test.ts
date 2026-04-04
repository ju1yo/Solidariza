import { describe, it, expect, beforeEach } from 'vitest'
import { NotificationService } from '@/core/services/notification.service'
import { prisma } from '@/lib/prisma'

describe('NotificationService', () => {
  let notificationService: NotificationService
  let userId: string

  beforeEach(async () => {
    notificationService = new NotificationService()

    const user = await prisma.user.create({
      data: {
        name: 'User 1',
        email: `user${Date.now()}@test.com`,
        password: 'pass'
      }
    })
    userId = user.id
  })

  it('should create a notification', async () => {
    const notif = await notificationService.create(userId, 'info', 'Test Title', 'Test Body', '/link')
    expect(notif.id).toBeDefined()
    expect(notif.userId).toBe(userId)
    expect(notif.read).toBe(false)
  })

  it('should list notifications for a user', async () => {
    await notificationService.create(userId, 'info', 'T1', 'B1')
    await notificationService.create(userId, 'warn', 'T2', 'B2')

    const list = await notificationService.list(userId)
    expect(list.length).toBe(2)
    expect(list[0].title).toBe('T2') // Ordered by createdAt desc
  })

  it('should count unread notifications', async () => {
    await notificationService.create(userId, 'info', 'T1', 'B1')
    const count = await notificationService.countUnread(userId)
    expect(count).toBe(1)
  })

  it('should mark a notification as read', async () => {
    const notif = await notificationService.create(userId, 'info', 'T1', 'B1')
    await notificationService.markAsRead(notif.id, userId)
    
    const count = await notificationService.countUnread(userId)
    expect(count).toBe(0)
  })

  it('should mark all notifications as read', async () => {
    await notificationService.create(userId, 'info', 'T1', 'B1')
    await notificationService.create(userId, 'info', 'T2', 'B2')
    
    await notificationService.markAllAsRead(userId)
    
    const count = await notificationService.countUnread(userId)
    expect(count).toBe(0)
  })
})
