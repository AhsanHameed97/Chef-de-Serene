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
    { label: 'Active Households', value: active, href: '/portal/admin/clients?status=ACTIVE' },
    { label: 'New Inquiries', value: newInquiries, href: '/portal/admin/inquiries', highlight: newInquiries > 0 },
    { label: 'Dishes on Menu', value: activeDishes, href: '/portal/admin/menu' },
  ]

  return (
    <>
      <PageIntro eyebrow="Concierge Admin" title="Kitchen & Client Overview">
        Weekly selections, approvals and inquiries at a glance.
      </PageIntro>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-[4px] border bg-surface p-5 transition-colors hover:border-gold/60 ${s.highlight ? 'border-gold/40' : 'border-line'}`}
          >
            <p className="mono-label text-[9.5px] text-muted">{s.label}</p>
            <p className={`mt-3 font-serif text-[40px] leading-none ${s.highlight ? 'text-gold' : ''}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[4px] border border-line bg-surface p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mono-label text-[10px] text-gold">Kitchen Prep List</p>
              <h2 className="mt-2 font-serif text-[24px] tracking-[-0.01em]">
                {next ? formatDeliveryDate(next.date) : 'No upcoming deliveries'}
              </h2>
            </div>
            {next && (
              <p className="mono-label text-[10px] text-muted">
                {next.orders} {next.orders === 1 ? 'household' : 'households'} · {next.meals} meals
              </p>
            )}
          </div>
          {next ? (
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {next.prep.map((line) => (
                <li key={line.title} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-[14.5px]">{line.title}</p>
                    <p className="mono-label mt-0.5 text-[9px] text-muted">{line.category}</p>
                  </div>
                  <span className="font-mono text-[15px] text-gold">× {line.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[14px] text-muted">Confirmed client selections will appear here, totalled per dish.</p>
          )}
          {upcoming.length > 1 && (
            <p className="mt-5 text-[13px] text-muted">
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
          <section className="rounded-[4px] border border-line bg-surface p-6">
            <p className="mono-label text-[10px] text-gold">Awaiting Approval</p>
            {pendingClients.length === 0 ? (
              <p className="mt-4 text-[14px] text-muted">No membership requests waiting.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {pendingClients.map((c) => (
                  <li key={c.id}>
                    <Link href={`/portal/admin/clients/${c.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-gold">
                      <span className="truncate text-[14px]">{c.name}</span>
                      <span className="mono-label shrink-0 text-[9.5px] text-muted">{c.weeklyQuota} meals</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-[4px] border border-line bg-surface p-6">
            <p className="mono-label text-[10px] text-gold">Latest Inquiries</p>
            {recentInquiries.length === 0 ? (
              <p className="mt-4 text-[14px] text-muted">No inquiries yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {recentInquiries.map((q) => (
                  <li key={q.id}>
                    <Link href="/portal/admin/inquiries" className="flex items-center justify-between gap-3 py-3 hover:text-gold">
                      <span className="min-w-0">
                        <span className="block truncate text-[14px]">{q.name}</span>
                        <span className="mono-label text-[9px] text-muted">{INQUIRY_TYPE_LABEL[q.type]}</span>
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
