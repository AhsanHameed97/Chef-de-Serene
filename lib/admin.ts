import { prisma } from '@/lib/db'
import { todayInLA } from '@/lib/delivery'

export type PrepLine = { title: string; category: string; quantity: number }

/** Upcoming confirmed orders grouped by delivery date, with aggregated kitchen prep totals. */
export async function getUpcomingPrep() {
  const orders = await prisma.order.findMany({
    where: { deliveryDate: { gte: todayInLA() } },
    orderBy: { deliveryDate: 'asc' },
    include: { items: { include: { menuItem: { select: { title: true, category: true } } } } },
  })

  const byDate = new Map<string, { date: Date; orders: number; meals: number; prep: Map<string, PrepLine> }>()
  for (const order of orders) {
    const key = order.deliveryDate.toISOString().slice(0, 10)
    const bucket = byDate.get(key) ?? { date: order.deliveryDate, orders: 0, meals: 0, prep: new Map() }
    bucket.orders += 1
    bucket.meals += order.totalMeals
    for (const item of order.items) {
      const line = bucket.prep.get(item.menuItemId) ?? { title: item.menuItem.title, category: item.menuItem.category, quantity: 0 }
      line.quantity += item.quantity
      bucket.prep.set(item.menuItemId, line)
    }
    byDate.set(key, bucket)
  }

  return [...byDate.entries()].map(([iso, b]) => ({
    iso,
    date: b.date,
    orders: b.orders,
    meals: b.meals,
    prep: [...b.prep.values()].sort((a, z) => z.quantity - a.quantity),
  }))
}
