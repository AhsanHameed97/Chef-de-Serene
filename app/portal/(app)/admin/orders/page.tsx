import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getUpcomingPrep } from '@/lib/admin'
import { formatDeliveryDate, fromISODate, todayInLA } from '@/lib/delivery'
import { updateOrderStatusAction } from '@/lib/actions/admin'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'
import { AutoSubmitSelect } from '@/components/admin/AutoSubmitSelect'

export const metadata: Metadata = { title: 'Orders', robots: { index: false } }

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PREPARATION', label: 'In Preparation' },
  { value: 'DELIVERED', label: 'Delivered' },
]

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const upcoming = await getUpcomingPrep()
  const showPast = params.view === 'past'
  const requested = typeof params.date === 'string' ? fromISODate(params.date) : null
  const selected = requested ?? (showPast ? null : (upcoming[0]?.date ?? null))
  const selectedISO = selected?.toISOString().slice(0, 10)

  const orders = await prisma.order.findMany({
    where: selected ? { deliveryDate: selected } : showPast ? { deliveryDate: { lt: todayInLA() } } : { id: '' },
    orderBy: [{ deliveryDate: 'desc' }, { createdAt: 'asc' }],
    take: 200,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, address: true, dietaryNotes: true } },
      items: { include: { menuItem: { select: { title: true } } }, orderBy: { quantity: 'desc' } },
    },
  })
  const prep = upcoming.find((u) => u.iso === selectedISO)?.prep

  return (
    <>
      <PageIntro eyebrow="Concierge Admin" title="Weekly Orders">
        Confirmed client selections by delivery date. Update status as meals move through the kitchen.
      </PageIntro>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {upcoming.map((u) => (
          <Link key={u.iso} href={`/portal/admin/orders?date=${u.iso}`} className="filter-pill" aria-pressed={u.iso === selectedISO}>
            {formatDeliveryDate(u.date, 'short')} · {u.meals}
          </Link>
        ))}
        <Link href="/portal/admin/orders?view=past" className="filter-pill" aria-pressed={showPast && !requested}>
          Past Deliveries
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="py-20 text-center text-muted">
          {upcoming.length === 0 && !showPast ? 'No upcoming orders yet. Confirmed client selections will appear here.' : 'No orders for this view.'}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-[4px] border border-line bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/portal/admin/clients/${order.user.id}`} className="font-serif text-[22px] tracking-[-0.01em] hover:text-gold">
                      {order.user.name}
                    </Link>
                    <p className="mono-label mt-1 text-[11.5px] text-muted">
                      {formatDeliveryDate(order.deliveryDate)} · {order.totalMeals} meals
                    </p>
                  </div>
                  <form key={order.status} action={updateOrderStatusAction} className="flex items-center gap-3">
                    <input type="hidden" name="id" value={order.id} />
                    <StatusBadge status={order.status} />
                    <AutoSubmitSelect name="status" label="Order status" defaultValue={order.status} options={STATUS_OPTIONS} />
                  </form>
                </div>

                <div className="mt-4 grid gap-2 text-[14.5px] text-muted sm:grid-cols-2">
                  <p>
                    <span className="mono-label mr-2 text-[11px]">Address</span>
                    <span className="text-alabaster/90">{order.user.address || '—'}</span>
                  </p>
                  <p>
                    <span className="mono-label mr-2 text-[11px]">Contact</span>
                    <a href={`mailto:${order.user.email}`} className="text-alabaster/90 hover:text-gold">
                      {order.user.email}
                    </a>
                    {order.user.phone && <> · {order.user.phone}</>}
                  </p>
                  {order.user.dietaryNotes && (
                    <p className="sm:col-span-2">
                      <span className="mono-label mr-2 text-[11px]">Dietary</span>
                      <span className="text-alabaster/90">{order.user.dietaryNotes}</span>
                    </p>
                  )}
                  {order.notes && (
                    <p className="rounded-[2px] border border-gold/30 bg-gold/[0.05] px-3 py-2 text-alabaster sm:col-span-2">
                      <span className="mono-label mr-2 text-[11px] text-gold">Note to Chef</span>
                      {order.notes}
                    </p>
                  )}
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="rounded-[2px] border border-line bg-obsidian px-3 py-1.5 text-[14px]">
                      {item.menuItem.title} <span className="font-mono text-gold">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {prep && (
            <aside className="h-fit rounded-[4px] border border-line bg-surface p-5 lg:sticky lg:top-24">
              <p className="mono-label text-[12px] text-gold">Prep Totals</p>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {prep.map((line) => (
                  <li key={line.title} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                    <span>{line.title}</span>
                    <span className="font-mono text-gold">×{line.quantity}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </>
  )
}
