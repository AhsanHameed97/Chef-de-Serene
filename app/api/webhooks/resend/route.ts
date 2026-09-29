import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

// POST /api/webhooks/resend — delivery events from Resend (bounces, complaints, deliveries).
// Configure in Resend → Webhooks with this URL and set RESEND_WEBHOOK_SECRET (whsec_…).

function verifySignature(secret: string, id: string, timestamp: string, body: string, header: string) {
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest()
  return header.split(' ').some((part) => {
    const [, sig] = part.split(',')
    if (!sig) return false
    const given = Buffer.from(sig, 'base64')
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 404 })

  const id = request.headers.get('svix-id') ?? ''
  const timestamp = request.headers.get('svix-timestamp') ?? ''
  const signature = request.headers.get('svix-signature') ?? ''
  const body = await request.text()

  const fresh = Math.abs(Date.now() / 1000 - Number(timestamp)) < 5 * 60
  if (!id || !fresh || !verifySignature(secret, id, timestamp, body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body) as { type?: string; data?: { to?: string[]; subject?: string } }
  if (event.type === 'email.bounced' || event.type === 'email.complained') {
    console.warn(`[resend] ${event.type}: ${event.data?.to?.join(', ')} — "${event.data?.subject}"`)
  } else {
    console.info(`[resend] ${event.type}`)
  }
  return NextResponse.json({ received: true })
}
