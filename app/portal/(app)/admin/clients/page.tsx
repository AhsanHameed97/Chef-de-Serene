import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { deliveryDayLabel } from '@/lib/plans'
import { setClientStatusAction } from '@/lib/actions/admin'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'
import type { AccountStatus } from '@/lib/generated/prisma/client'

export const metadata: Metadata = { title: 'Clients', robots: { index: false } }

const FILTERS: { value?: AccountStatus; label: string }[] = [
  { label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
]

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AdminClientsPage({ searchParams }: Props) {
  const params = await searchParams
  const status = FILTERS.find((f) => f.value && f.value === params.status)?.value
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT', ...(status ? { status } : {}) },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { orders: true } } },
  })

  return (
    <>
      <PageIntro
        eyebrow="Concierge Admin"
        title="Client Households"
        actions={
          <Link href="/portal/admin/clients/new" className="btn-gold">
            + Add Client
          </Link>
        }
      >
        Approve new memberships, adjust weekly quotas and manage delivery details.
      </PageIntro>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/portal/admin/clients?status=${f.value}` : '/portal/admin/clients'}
            className="filter-pill"
            aria-pressed={status === f.value}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-[4px] border border-line">
        <table className="w-full min-w-[820px] text-left text-[15.5px]">
          <thead className="bg-surface">
            <tr className="mono-label text-[11.5px] text-muted">
              <th className="px-5 py-3.5 font-normal">Household</th>
              <th className="px-5 py-3.5 font-normal">Status</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">Delivery</th>
              <th className="px-5 py-3.5 font-normal">Orders</th>
              <th className="px-5 py-3.5 font-normal">Joined</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-surface/60">
                <td className="px-5 py-4">
                  <Link href={`/portal/admin/clients/${c.id}`} className="hover:text-gold">
                    {c.name}
                  </Link>
                  <p className="text-[14px] text-muted">{c.email}</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-4 font-mono text-[14.5px]">{c.weeklyQuota} / wk</td>
                <td className="px-5 py-4 text-muted">{deliveryDayLabel(c.deliveryDay)}</td>
                <td className="px-5 py-4 font-mono text-[14.5px] text-muted">{c._count.orders}</td>
                <td className="px-5 py-4 text-[14.5px] text-muted">
                  {c.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {c.status === 'PENDING' && (
                      <form action={setClientStatusAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="status" value="ACTIVE" />
                        <button type="submit" className="btn-ghost-gold px-3 py-2 text-[13px]">
                          Activate
                        </button>
                      </form>
                    )}
                    <Link href={`/portal/admin/clients/${c.id}`} className="mono-label text-[12px] text-muted hover:text-gold">
                      Manage →
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && <p className="bg-surface/40 py-14 text-center text-muted">No client households in this view.</p>}
      </div>
    </>
  )
}
