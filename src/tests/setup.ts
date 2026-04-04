import '@testing-library/jest-dom'
import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client-test'

// Use a shared prisma instance for tests
// Note: In integration tests, we'll ensure this points to the test.db
export const prisma = new PrismaClient()

// Mock the main PrismaClient to use our test client singleton
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      constructor() {
        return prisma
      }
    }
  }
})

beforeAll(async () => {
  // Ensure we are connected
  await prisma.$connect()
})

beforeEach(async () => {
  // Clear the database before each test
  // This is a simple cleanup strategy. For large schemas, you might want something more optimized.
  const tables = ['comment', 'rating', 'notification', 'donation', 'message', 'conversation', 'helpRequest', 'user']
  
  for (const table of tables) {
    await (prisma as any)[table].deleteMany()
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}))
// Mock window.scrollTo
window.scrollTo = vi.fn()
