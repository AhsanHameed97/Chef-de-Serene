import { Resend } from 'resend'

export type EmailMessage = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

let resendClient: Resend | null = null

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  resendClient ??= new Resend(key)
  return resendClient
}

/** Chef Dwayne's inbox (comma-separated list supported). */
export function notifyRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL || 'Dwayne@chefdeserene.net')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Sends through Resend. Without RESEND_API_KEY (local dev) the message is
 * printed to the server console instead, so every flow stays testable.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.info(
      `\n──── [email:dev] ────\nTo: ${[message.to].flat().join(', ')}\nSubject: ${message.subject}\n\n${message.text}\n─────────────────────\n`,
    )
    return
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Chef de Serene <onboarding@resend.dev>',
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}

/** Notifications must never break the user's action — log and continue. */
export async function sendEmailSafely(message: EmailMessage): Promise<boolean> {
  try {
    await sendEmail(message)
    return true
  } catch (err) {
    console.error('[email] failed to send', message.subject, err)
    return false
  }
}
