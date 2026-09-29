'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { createMagicLink, requireAdmin } from '@/lib/auth'
import { adminClientSchema, adminNewClientSchema, fieldErrors, menuItemSchema } from '@/lib/validation'
import { sendEmail, sendEmailSafely } from '@/lib/email'
import { accountActivatedEmail, magicLinkEmail } from '@/lib/email-templates'
import { planName } from '@/lib/plans'
import { appUrl } from '@/lib/url'
import type { FormState } from '@/lib/actions/types'
import type { AccountStatus, InquiryStatus, OrderStatus } from '@/lib/generated/prisma/client'

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PREPARATION', 'DELIVERED']
const INQUIRY_STATUSES: InquiryStatus[] = ['NEW', 'CONTACTED', 'CLOSED']
const ACCOUNT_STATUSES: AccountStatus[] = ['PENDING', 'ACTIVE', 'PAUSED']

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '')

async function notifyActivated(user: { name: string; email: string; weeklyQuota: number }) {
  await sendEmailSafely({
    to: user.email,
    ...accountActivatedEmail({ name: user.name, weeklyQuota: user.weeklyQuota, loginUrl: `${appUrl()}/portal/login` }),
  })
}

/** Keep the Subscription history in step with the client's weekly quota. */
async function syncSubscription(userId: string, quota: number) {
  const current = await prisma.subscription.findFirst({ where: { userId, active: true }, orderBy: { startDate: 'desc' } })
  if (current?.mealsPerWk === quota) return
  await prisma.$transaction([
    prisma.subscription.updateMany({ where: { userId, active: true }, data: { active: false } }),
    prisma.subscription.create({ data: { userId, planName: planName(quota), mealsPerWk: quota } }),
  ])
}

/* ---------------- Clients ---------------- */

export async function updateClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const id = str(formData, 'id')
  const keys = ['name', 'phone', 'address', 'deliveryDay', 'weeklyQuota', 'status', 'dietaryNotes']
  const values = Object.fromEntries(keys.map((k) => [k, str(formData, k)]))
  const parsed = adminClientSchema.safeParse(values)
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  const before = await prisma.user.findUnique({ where: { id } })
  if (!before) return { message: 'Client not found.', values }

  const d = parsed.data
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: d.name,
      phone: d.phone ?? null,
      address: d.address ?? null,
      deliveryDay: d.deliveryDay,
      weeklyQuota: d.weeklyQuota,
      status: d.status,
      dietaryNotes: d.dietaryNotes ?? null,
    },
  })
  if (user.role === 'CLIENT') await syncSubscription(id, d.weeklyQuota)
  if (before.status !== 'ACTIVE' && user.status === 'ACTIVE') await notifyActivated(user)

  revalidatePath('/portal/admin', 'layout')
  return {
    ok: true,
    message: before.status !== 'ACTIVE' && user.status === 'ACTIVE' ? 'Saved — the client has been emailed that their portal is active.' : 'Client saved.',
    values,
  }
}

export async function setClientStatusAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const status = str(formData, 'status') as AccountStatus
  if (!ACCOUNT_STATUSES.includes(status)) return
  const before = await prisma.user.findUnique({ where: { id: str(formData, 'id') } })
  if (!before) return
  const user = await prisma.user.update({ where: { id: before.id }, data: { status } })
  if (before.status !== 'ACTIVE' && status === 'ACTIVE') await notifyActivated(user)
  revalidatePath('/portal/admin', 'layout')
}

export async function createClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const keys = ['email', 'name', 'phone', 'address', 'deliveryDay', 'weeklyQuota', 'status', 'dietaryNotes']
  const values = Object.fromEntries(keys.map((k) => [k, str(formData, k)]))
  const parsed = adminNewClientSchema.safeParse(values)
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  const d = parsed.data
  if (await prisma.user.findUnique({ where: { email: d.email }, select: { id: true } })) {
    return { errors: { email: 'A household with this email already exists.' }, values }
  }

  const user = await prisma.user.create({
    data: {
      email: d.email,
      name: d.name,
      phone: d.phone,
      address: d.address,
      deliveryDay: d.deliveryDay,
      weeklyQuota: d.weeklyQuota,
      status: d.status,
      dietaryNotes: d.dietaryNotes,
      subscriptions: { create: { planName: planName(d.weeklyQuota), mealsPerWk: d.weeklyQuota } },
    },
  })

  if (formData.get('sendInvite') === 'on') {
    const url = await createMagicLink(user.id)
    if (url) await sendEmailSafely({ to: user.email, ...magicLinkEmail({ name: user.name, url }) })
  }

  revalidatePath('/portal/admin', 'layout')
  redirect(`/portal/admin/clients/${user.id}?created=1`)
}

export async function sendLoginLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: str(formData, 'id') } })
  if (!user) return { message: 'Client not found.' }
  const url = await createMagicLink(user.id)
  if (!url) return { message: 'A link was sent less than a minute ago. Please wait before sending another.' }
  try {
    await sendEmail({ to: user.email, ...magicLinkEmail({ name: user.name, url }) })
  } catch {
    return { message: 'The email could not be sent. Check the Resend configuration.' }
  }
  return { ok: true, message: `Sign-in link sent to ${user.email}.` }
}

/* ---------------- Orders ---------------- */

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const status = str(formData, 'status') as OrderStatus
  if (!ORDER_STATUSES.includes(status)) return
  await prisma.order.update({ where: { id: str(formData, 'id') }, data: { status } })
  revalidatePath('/portal/admin', 'layout')
}

/* ---------------- Menu ---------------- */

export async function saveMenuItemAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const id = str(formData, 'id')
  const keys = ['title', 'description', 'imageUrl', 'category', 'specs', 'calories', 'proteinG', 'carbsG', 'fatG', 'sortOrder']
  const values = Object.fromEntries(keys.map((k) => [k, str(formData, k)]))
  const parsed = menuItemSchema.safeParse({ ...values, active: formData.get('active') })
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { ...values, active: String(formData.get('active') === 'on') } }

  const data = {
    ...parsed.data,
    calories: parsed.data.calories ?? null,
    proteinG: parsed.data.proteinG ?? null,
    carbsG: parsed.data.carbsG ?? null,
    fatG: parsed.data.fatG ?? null,
  }
  if (id) await prisma.menuItem.update({ where: { id }, data })
  else await prisma.menuItem.create({ data })

  revalidatePath('/portal', 'layout')
  revalidatePath('/current-menu')
  redirect('/portal/admin/menu?saved=1')
}

export async function toggleMenuItemAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const item = await prisma.menuItem.findUnique({ where: { id: str(formData, 'id') } })
  if (!item) return
  await prisma.menuItem.update({ where: { id: item.id }, data: { active: !item.active } })
  revalidatePath('/portal', 'layout')
  revalidatePath('/current-menu')
}

export async function deleteMenuItemAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = str(formData, 'id')
  const used = await prisma.orderItem.count({ where: { menuItemId: id } })
  // Dishes that appear in past orders are archived (hidden) rather than deleted, to keep order history intact.
  if (used > 0) await prisma.menuItem.update({ where: { id }, data: { active: false } })
  else await prisma.menuItem.delete({ where: { id } })
  revalidatePath('/portal', 'layout')
  revalidatePath('/current-menu')
  redirect(`/portal/admin/menu?${used > 0 ? 'archived' : 'deleted'}=1`)
}

/* ---------------- Inquiries ---------------- */

export async function updateInquiryStatusAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const status = str(formData, 'status') as InquiryStatus
  if (!INQUIRY_STATUSES.includes(status)) return
  await prisma.inquiry.update({ where: { id: str(formData, 'id') }, data: { status } })
  revalidatePath('/portal/admin', 'layout')
}
