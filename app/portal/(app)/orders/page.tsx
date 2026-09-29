import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { formatDeliveryDate } from '@/lib/delivery'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'

export const metadata: Metadata = { title: 'Order History', robots: { index: false } }

export default async function OrdersPage() {
  const user = await requireUser()
  if (user.role === 'ADMIN') redirect('/portal/admin/orders')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { deliveryDate: 'desc' },
    take: 52,
    include: { items: { include: { menuItem: { select: { title: true } } }, orderBy: { quantity: 'desc' } } },
  })

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:py-14">
      <PageIntro eyebrow="Client Portal" title="Order History">
        Every confirmed weekly allocation for your household.
      </PageIntro>

      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted">No confirmed selections yet.</p>
          <Link href="/portal/dashboard" className="btn-gold mt-6">
            Select This Week’s Meals &rarr;
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-[4px] border border-line bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-[22px] tracking-[-0.01em]">{formatDeliveryDate(order.deliveryDate)}</p>
                  <p className="mono-label mt-1 text-[11.5px] text-muted">{order.totalMeals} meals</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <li key={item.id} className="rounded-[2px] border border-line bg-obsidian px-3 py-1.5 text-[14px] text-muted">
                    {item.menuItem.title} <span className="font-mono text-gold">×{item.quantity}</span>
                  </li>
                ))}
              </ul>
              {order.notes && <p className="mt-4 text-[14.5px] text-muted">Note: {order.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
