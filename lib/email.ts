import nodemailer, { type Transporter } from 'nodemailer'
import { Resend } from 'resend'

export type EmailMessage = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

let resendClient: Resend | null = null
let smtpTransport: Transporter | null = null

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  resendClient ??= new Resend(key)
  return resendClient
}

/** Any SMTP server (e.g. Gmail with an App Password) — delivers to any recipient without a verified domain. */
function getSmtp(): Transporter | null {
  const { SMTP_HOST: host, SMTP_USER: user, SMTP_PASS: pass } = process.env
  if (!host || !user || !pass) return null
  const port = Number(process.env.SMTP_PORT || 465)
  smtpTransport ??= nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
  return smtpTransport
}

function fromAddress() {
  return process.env.EMAIL_FROM || (process.env.SMTP_USER ? `Chef de Serene <${process.env.SMTP_USER}>` : 'Chef de Serene <onboarding@resend.dev>')
}

/** Chef Dwayne's inbox (comma-separated list supported). */
export function notifyRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL || 'Dwayne@chefdeserene.net')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Sends through Resend (RESEND_API_KEY) or SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS).
 * With neither configured (local dev) the message is printed to the server console.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const resend = getResend()
  const smtp = resend ? null : getSmtp()

  if (smtp) {
    await smtp.sendMail({
      from: fromAddress(),
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    })
    return
  }

  if (!resend) {
    console.info(
      `\n──── [email:dev] ────\nTo: ${[message.to].flat().join(', ')}\nSubject: ${message.subject}\n\n${message.text}\n─────────────────────\n`,
    )
    return
  }

  const { error } = await resend.emails.send({
    from: fromAddress(),
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
