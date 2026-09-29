import { createHash, randomBytes } from 'node:crypto'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from '@/lib/session'
import { appUrl } from '@/lib/url'
import type { User } from '@/lib/generated/prisma/client'

/* ---------------- Sessions ---------------- */

export async function createSession(user: Pick<User, 'id' | 'role'>) {
  const token = await signSession({ sub: user.id, role: user.role })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export const getSession = cache(async () => {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value)
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null
  return prisma.user.findUnique({ where: { id: session.sub } })
})

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect((await getSession()) ? '/api/auth/reset-session' : '/portal/login')
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser()
  if (user.role !== 'ADMIN') redirect('/portal/dashboard')
  return user
}

export function homePathFor(user: Pick<User, 'role'>) {
  return user.role === 'ADMIN' ? '/portal/admin' : '/portal/dashboard'
}

/* ---------------- Magic links ---------------- */

const MAGIC_LINK_TTL_MS = 20 * 60 * 1000 // 20 minutes
const MAGIC_LINK_COOLDOWN_MS = 60 * 1000 // one email per minute per account

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

/** Returns a sign-in URL, or null if a link was sent within the cooldown window. */
export async function createMagicLink(userId: string, next?: string): Promise<string | null> {
  const recent = await prisma.magicLinkToken.findFirst({
    where: { userId, createdAt: { gt: new Date(Date.now() - MAGIC_LINK_COOLDOWN_MS) } },
    select: { id: true },
  })
  if (recent) return null

  const token = randomBytes(32).toString('base64url')
  await prisma.magicLinkToken.create({
    data: { tokenHash: hashToken(token), userId, expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS) },
  })
  const url = new URL('/portal/verify', appUrl())
  url.searchParams.set('token', token)
  if (next) url.searchParams.set('next', next)
  return url.toString()
}

/** Read-only validity check (used to render the verify page without consuming the token). */
export async function peekMagicLink(token: string) {
  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { usedAt: true, expiresAt: true, user: { select: { name: true, email: true } } },
  })
  if (!record || record.usedAt || record.expiresAt < new Date()) return null
  return record.user
}

/** Single-use: marks the token as used and returns its user, or null if invalid/expired. */
export async function consumeMagicLink(token: string): Promise<User | null> {
  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })
  if (!record || record.usedAt || record.expiresAt < new Date()) return null

  const { count } = await prisma.magicLinkToken.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  })
  return count === 1 ? record.user : null
}
