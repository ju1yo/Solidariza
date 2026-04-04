import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from '@/core/services/user.service'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/core/domain/errors/domain.error'
import { hash } from 'bcrypt'

describe('UserService', () => {
  let userService: UserService

  beforeEach(async () => {
    userService = new UserService()
  })

  it('should register a new user successfully', async () => {
    const data = {
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'usuario' as const
    }

    const user = await userService.register(data as any)
    expect(user.id).toBeDefined()
    expect(user.email).toBe(data.email)
    expect(user.name).toBe(data.name)
    
    // Check if password was hashed
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    expect(dbUser?.password).not.toBe(data.password)
  })

  it('should fail if email already exists', async () => {
    const data = {
      name: 'Existing User',
      email: 'exists@test.com',
      password: 'password123',
      role: 'usuario' as const
    }

    await userService.register(data as any)
    await expect(userService.register(data as any)).rejects.toThrow(AppError)
  })

  it('should validate correct credentials', async () => {
    const password = 'mypassword'
    const email = 'valid@test.com'
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        name: 'Valid User',
        email,
        password: hashedPassword,
        role: 'usuario'
      }
    })

    const user = await userService.validateCredentials(email, password)
    expect(user).not.toBeNull()
    expect(user?.email).toBe(email)
  })

  it('should return null for invalid email', async () => {
    const user = await userService.validateCredentials('none@test.com', 'pass')
    expect(user).toBeNull()
  })

  it('should return null for invalid password', async () => {
    const password = 'mypassword'
    const email = 'invalidpass@test.com'
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        name: 'Valid User',
        email,
        password: hashedPassword,
        role: 'usuario'
      }
    })

    const user = await userService.validateCredentials(email, 'wrongpass')
    expect(user).toBeNull()
  })
})
