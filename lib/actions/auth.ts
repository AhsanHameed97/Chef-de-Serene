'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { consumeMagicLink, createMagicLink, createSession, destroySession, homePathFor } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/password'
import { fieldErrors, loginSchema, magicLinkSchema, signupSchema } from '@/lib/validation'
import { notifyRecipients, sendEmail, sendEmailSafely } from '@/lib/email'
import { magicLinkEmail, signupAlertEmail, signupReceivedEmail } from '@/lib/email-templates'
import { planName } from '@/lib/plans'
import { appUrl, safeNextPath } from '@/lib/url'
import type { FormState } from '@/lib/actions/types'

// Equalises response time for unknown emails so accounts can't be probed by timing.
let dummyHash: Promise<string> | null = null
const getDummyHash = () => (dummyHash ??= hashPassword('not-a-real-password'))

function portalNext(value: FormDataEntryValue | null): string | undefined {
  const next = typeof value === 'string' ? value : ''
  return next.startsWith('/portal/') && !next.startsWith('//') ? next : undefined
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get('email') ?? '') }
  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') })
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? (await getDummyHash()))
  if (!user || !user.passwordHash || !valid) {
    return { message: 'Incorrect email or password. You can also sign in with an email link.', values }
  }

  await createSession(user)
  redirect(safeNextPath(portalNext(formData.get('next')), homePathFor(user)))
}

export async function magicLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get('email') ?? '') }
  const parsed = magicLinkSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  const sent: FormState = {
    ok: true,
    message: `If an account exists for ${parsed.data.email}, a sign-in link is on its way. It expires in 20 minutes.`,
    values,
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) return sent

  const url = await createMagicLink(user.id, portalNext(formData.get('next')))
  if (!url) return sent // cooldown: a link was sent within the last minute

  try {
    await sendEmail({ to: user.email, ...magicLinkEmail({ name: user.name, url }) })
  } catch (err) {
    console.error('[auth] magic link email failed', err)
    return { message: 'We could not send the email right now. Please try again shortly or sign in with your password.', values }
  }

  // Local development without an email provider: surface the link on screen for convenience.
  const devLink = process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY && !process.env.SMTP_HOST ? url : undefined
  return { ...sent, devLink }
}

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const keys = ['name', 'email', 'phone', 'address', 'deliveryDay', 'plan', 'dietaryNotes'] as const
  const values = Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? '')]))
  const parsed = signupSchema.safeParse({ ...values, password: formData.get('password') ?? '', confirm: formData.get('confirm') ?? '' })
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  const d = parsed.data
  const existing = await prisma.user.findUnique({ where: { email: d.email }, select: { id: true } })
  if (existing) {
    return { errors: { email: 'An account with this email already exists. Please sign in instead.' }, values }
  }

  const quota = Number(d.plan)
  // Accounts are active immediately; set REQUIRE_SIGNUP_APPROVAL=true to review each signup first.
  const needsApproval = process.env.REQUIRE_SIGNUP_APPROVAL === 'true'
  const user = await prisma.user.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone,
      address: d.address,
      deliveryDay: d.deliveryDay,
      dietaryNotes: d.dietaryNotes,
      weeklyQuota: quota,
      status: needsApproval ? 'PENDING' : 'ACTIVE',
      passwordHash: await hashPassword(d.password),
      subscriptions: { create: { planName: planName(quota), mealsPerWk: quota } },
    },
  })

  await Promise.all([
    sendEmailSafely({
      to: notifyRecipients(),
      replyTo: user.email,
      ...signupAlertEmail({ member: user, pending: needsApproval, reviewUrl: `${appUrl()}/portal/admin/clients/${user.id}` }),
    }),
    sendEmailSafely({
      to: user.email,
      ...signupReceivedEmail({ name: user.name, autoApproved: !needsApproval, dashboardUrl: `${appUrl()}/portal/dashboard` }),
    }),
  ])

  await createSession(user)
  redirect('/portal/dashboard?welcome=1')
}

/** Consumes a magic-link token on explicit click (email scanners can't burn it via GET). */
export async function verifyMagicLinkAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '')
  const user = token ? await consumeMagicLink(token) : null
  if (!user) redirect('/portal/login?error=link')

  await createSession(user)
  redirect(safeNextPath(portalNext(formData.get('next')), homePathFor(user)))
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/portal/login')
}
