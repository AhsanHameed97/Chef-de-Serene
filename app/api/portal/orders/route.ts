import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { orderSchema } from '@/lib/validation'
import { formatDeliveryDate, nextDeliveryDate } from '@/lib/delivery'
import { notifyRecipients, sendEmailSafely } from '@/lib/email'
import { orderAlertEmail, orderConfirmationEmail } from '@/lib/email-templates'
import { appUrl } from '@/lib/url'
import { Prisma } from '@/lib/generated/prisma/client'

// POST /api/portal/orders — confirm the signed-in client's weekly meal selection.
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  if (user.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Your membership is not active yet. Our concierge team will be in touch.' }, { status: 403 })
  }

  const parsed = orderSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid selection.' }, { status: 400 })

  // Merge duplicate lines defensively.
  const quantities = new Map<string, number>()
  for (const { menuItemId, quantity } of parsed.data.items) {
    quantities.set(menuItemId, (quantities.get(menuItemId) ?? 0) + quantity)
  }
  const totalMeals = [...quantities.values()].reduce((a, b) => a + b, 0)

  // Server-side quota rule (Master Spec §3): selected_count <= weeklyQuota
  if (totalMeals > user.weeklyQuota) {
    return NextResponse.json({ error: `Quota Exceeded — your allocation is ${user.weeklyQuota} meals.` }, { status: 400 })
  }
  if (totalMeals < user.weeklyQuota) {
    return NextResponse.json(
      { error: `Please select all ${user.weeklyQuota} meals (${user.weeklyQuota - totalMeals} remaining).` },
      { status: 400 },
    )
  }

  const dishes = await prisma.menuItem.findMany({ where: { id: { in: [...quantities.keys()] }, active: true } })
  if (dishes.length !== quantities.size) {
    return NextResponse.json({ error: 'Some dishes are no longer on this week’s menu. Please refresh and review.' }, { status: 409 })
  }

  const deliveryDate = nextDeliveryDate(user.deliveryDay)
  let order
  try {
    order = await prisma.order.create({
      data: {
        userId: user.id,
        deliveryDate,
        status: 'CONFIRMED',
        totalMeals,
        notes: parsed.data.notes,
        items: { create: [...quantities].map(([menuItemId, quantity]) => ({ menuItemId, quantity })) },
      },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'This week’s selection is already confirmed.' }, { status: 409 })
    }
    throw err
  }

  const titles = new Map(dishes.map((d) => [d.id, d.title]))
  const summary = {
    clientName: user.name,
    clientEmail: user.email,
    phone: user.phone,
    address: user.address,
    dietaryNotes: [user.dietaryNotes, parsed.data.notes && `Note for this week: ${parsed.data.notes}`].filter(Boolean).join('\n'),
    deliveryLabel: formatDeliveryDate(deliveryDate),
    totalMeals,
    items: [...quantities]
      .map(([id, quantity]) => ({ title: titles.get(id) ?? 'Dish', quantity }))
      .sort((a, b) => b.quantity - a.quantity),
  }

  await Promise.all([
    sendEmailSafely({
      to: notifyRecipients(),
      replyTo: user.email,
      ...orderAlertEmail({ ...summary, adminUrl: `${appUrl()}/portal/admin/orders` }),
    }),
    sendEmailSafely({ to: user.email, ...orderConfirmationEmail({ ...summary, dashboardUrl: `${appUrl()}/portal/dashboard` }) }),
  ])

  return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 })
}
