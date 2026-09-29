import { prisma } from '@/lib/db'
import { MIN_LEAD_DAYS, addDays, daysFromToday, formatDeliveryDate, nextDeliveryDate, toISODate } from '@/lib/delivery'
import type { User } from '@/lib/generated/prisma/client'

export type DishView = {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  specs: string[]
  calories: number | null
  proteinG: number | null
  carbsG: number | null
  fatG: number | null
}

export function toDishView(item: DishView): DishView {
  const { id, title, description, imageUrl, category, specs, calories, proteinG, carbsG, fatG } = item
  return { id, title, description, imageUrl, category, specs, calories, proteinG, carbsG, fatG }
}

export function getActiveMenu() {
  return prisma.menuItem.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
}

/** Everything the client dashboard needs for the upcoming delivery week. */
export async function getClientWeek(user: Pick<User, 'id' | 'deliveryDay'>) {
  const deliveryDate = nextDeliveryDate(user.deliveryDay)
  const closesOn = addDays(deliveryDate, -MIN_LEAD_DAYS)
  const [order, menu] = await Promise.all([
    prisma.order.findUnique({
      where: { userId_deliveryDate: { userId: user.id, deliveryDate } },
      include: { items: { include: { menuItem: true }, orderBy: { quantity: 'desc' } } },
    }),
    getActiveMenu(),
  ])
  return {
    deliveryDate,
    deliveryISO: toISODate(deliveryDate),
    deliveryLabel: formatDeliveryDate(deliveryDate),
    closesLabel: formatDeliveryDate(closesOn),
    closesShort: formatDeliveryDate(closesOn, 'short'),
    deliveryShort: formatDeliveryDate(deliveryDate, 'short'),
    daysToClose: daysFromToday(closesOn),
    order,
    menu: menu.map(toDishView),
  }
}
