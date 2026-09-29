import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getUpcomingPrep } from '@/lib/admin'
import { formatDeliveryDate } from '@/lib/delivery'
import { INQUIRY_TYPE_LABEL } from '@/lib/inquiry'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'

export const metadata: Metadata = { title: 'Admin Overview', robots: { index: false } }

export default async function AdminOverviewPage() {
  const [pending, active, newInquiries, activeDishes, upcoming, recentInquiries, pendingClients] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT', status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CLIENT', status: 'ACTIVE' } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.menuItem.count({ where: { active: true } }),
    getUpcomingPrep(),
    prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.user.findMany({ where: { role: 'CLIENT', status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ])
  const next = upcoming[0]

  const stats = [
    { label: 'Pending Approvals', value: pending, href: '/portal/admin/clients?status=PENDING', highlight: pending > 0 },
    { label: 'Active Clients', value: active, href: '/portal/admin/clients?status=ACTIVE' },
    { label: 'New Bookings', value: newInquiries, href: '/portal/admin/inquiries', highlight: newInquiries > 0 },
    { label: 'Dishes on Menu', value: activeDishes, href: '/portal/admin/menu' },
  ]

  return (
    <>
      <PageIntro
        eyebrow="Concierge Admin"
        title={
          <>
            Kitchen &amp; <em>Client Overview</em>
          </>
        }
      >
        Weekly orders, new clients and booking requests at a glance.
      </PageIntro>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`lux-card lux-card-hover group rounded-[4px] p-6 ${s.highlight ? '!border-gold/45' : ''}`}
          >
            <p className="mono-label flex items-center justify-between text-[11.5px] text-muted">
              {s.label}
              <span className="text-gold/70 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </p>
            <p className={`mt-4 font-serif text-[48px] leading-none ${s.highlight ? 'gold-text' : ''}`}>{s.value}</p>
            {s.highlight && <p className="mt-2 text-[13px] text-gold">Needs attention</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="lux-card rounded-[4px] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mono-label text-[12px] text-gold">Kitchen Prep List</p>
              <h2 className="mt-2 font-serif text-[24px] tracking-[-0.01em]">
                {next ? formatDeliveryDate(next.date) : 'No upcoming deliveries'}
              </h2>
            </div>
            {next && (
              <p className="mono-label text-[12px] text-muted">
                {next.orders} {next.orders === 1 ? 'household' : 'households'} · {next.meals} meals
              </p>
            )}
          </div>
          {next ? (
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {next.prep.map((line) => (
                <li key={line.title} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-[16px]">{line.title}</p>
                    <p className="mono-label mt-0.5 text-[11px] text-muted">{line.category}</p>
                  </div>
                  <span className="font-mono text-[16.5px] text-gold">× {line.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15.5px] text-muted">Confirmed client selections will appear here, totalled per dish.</p>
          )}
          {upcoming.length > 1 && (
            <p className="mt-5 text-[14.5px] text-muted">
              Also scheduled:{' '}
              {upcoming.slice(1).map((u, i) => (
                <span key={u.iso}>
                  {i > 0 && ', '}
                  <Link href={`/portal/admin/orders?date=${u.iso}`} className="text-gold hover:underline">
                    {formatDeliveryDate(u.date, 'short')} ({u.meals} meals)
                  </Link>
                </span>
              ))}
            </p>
          )}
          {next && (
            <Link href={`/portal/admin/orders?date=${next.iso}`} className="btn-outline mt-6">
              View Household Orders &rarr;
            </Link>
          )}
        </section>

        <div className="space-y-6">
          <section className="lux-card rounded-[4px] p-6">
            <p className="mono-label text-[12px] text-gold">Awaiting Approval</p>
            {pendingClients.length === 0 ? (
              <p className="mt-4 text-[15.5px] text-muted">No accounts waiting for approval.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {pendingClients.map((c) => (
                  <li key={c.id}>
                    <Link href={`/portal/admin/clients/${c.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-gold">
                      <span className="truncate text-[15.5px]">{c.name}</span>
                      <span className="mono-label shrink-0 text-[11.5px] text-muted">{c.weeklyQuota} meals</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="lux-card rounded-[4px] p-6">
            <p className="mono-label text-[12px] text-gold">Latest Booking Requests</p>
            {recentInquiries.length === 0 ? (
              <p className="mt-4 text-[15.5px] text-muted">No booking requests yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {recentInquiries.map((q) => (
                  <li key={q.id}>
                    <Link href="/portal/admin/inquiries" className="flex items-center justify-between gap-3 py-3 hover:text-gold">
                      <span className="min-w-0">
                        <span className="block truncate text-[15.5px]">{q.name}</span>
                        <span className="mono-label text-[11px] text-muted">{INQUIRY_TYPE_LABEL[q.type]}</span>
                      </span>
                      <StatusBadge status={q.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
