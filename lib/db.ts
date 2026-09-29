import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

// Reuse one client (and one connection pool) across hot reloads in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
