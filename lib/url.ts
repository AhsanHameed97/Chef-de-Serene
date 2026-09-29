export function appUrl(): string {
  const explicit = process.env.APP_URL?.replace(/\/$/, '')
  if (explicit) return explicit
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

/** Only allow same-site relative redirects (prevents open redirects via ?next=). */
export function safeNextPath(next: unknown, fallback = '/portal/dashboard'): string {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback
  return next
}
