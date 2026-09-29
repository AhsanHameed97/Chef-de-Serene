import { SignJWT, jwtVerify } from 'jose'

// Edge/Node-safe session primitives (no DB access) — shared by proxy.ts and the server.

export const SESSION_COOKIE = 'cds_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export type SessionRole = 'CLIENT' | 'ADMIN'
export type SessionPayload = { sub: string; role: SessionRole }

function secretKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must be set (32+ characters)')
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    if (typeof payload.sub !== 'string') return null
    const role = payload.role === 'ADMIN' ? 'ADMIN' : 'CLIENT'
    return { sub: payload.sub, role }
  } catch {
    return null
  }
}
