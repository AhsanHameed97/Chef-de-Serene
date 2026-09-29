import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { formatDeliveryDate, nextDeliveryDate } from '@/lib/delivery'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'
import { ClientForm } from '@/components/admin/ClientForm'
import { SendLinkButton } from '@/components/admin/SendLinkButton'
import { FormAlert } from '@/components/portal/forms'

export const metadata: Metadata = { title: 'Manage Client', robots: { index: false } }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ClientDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { created } = await searchParams
  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { deliveryDate: 'desc' }, take: 12 },
      subscriptions: { orderBy: { startDate: 'desc' }, take: 5 },
    },
  })
  if (!client || client.role !== 'CLIENT') notFound()

  return (
    <>
      <PageIntro eyebrow="Client Household" title={client.name} actions={<StatusBadge status={client.status} />}>
        {client.email} · Next delivery window {formatDeliveryDate(nextDeliveryDate(client.deliveryDay))}
      </PageIntro>

      {created && (
        <div className="mt-6">
          <FormAlert state={{ ok: true, message: 'Client household created.' }} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-[4px] border border-line bg-surface p-6 sm:p-8">
          <ClientForm
            mode="edit"
            initial={{
              id: client.id,
              name: client.name,
              phone: client.phone ?? '',
              address: client.address ?? '',
              deliveryDay: client.deliveryDay,
              weeklyQuota: String(client.weeklyQuota),
              status: client.status,
              dietaryNotes: client.dietaryNotes ?? '',
            }}
          />
        </section>

        <aside className="space-y-6">
          <section className="rounded-[4px] border border-line bg-surface p-6">
            <p className="mono-label text-[10px] text-gold">Portal Access</p>
            <p className="mb-4 mt-2 text-[13px] text-muted">
              {client.passwordHash ? 'Client has a passcode set. ' : 'No passcode set — client signs in by magic link. '}
              Send a one-click sign-in link to their inbox.
            </p>
            <SendLinkButton id={client.id} />
          </section>

          <section className="rounded-[4px] border border-line bg-surface p-6">
            <p className="mono-label text-[10px] text-gold">Recent Orders</p>
            {client.orders.length === 0 ? (
              <p className="mt-3 text-[13px] text-muted">No orders yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {client.orders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link
                      href={`/portal/admin/orders?date=${o.deliveryDate.toISOString().slice(0, 10)}`}
                      className="text-[13.5px] hover:text-gold"
                    >
                      {formatDeliveryDate(o.deliveryDate, 'short')} · {o.totalMeals}
                    </Link>
                    <StatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[4px] border border-line bg-surface p-6">
            <p className="mono-label text-[10px] text-gold">Plan History</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              {client.subscriptions.map((s) => (
                <li key={s.id} className="flex justify-between gap-3">
                  <span className={s.active ? '' : 'text-muted line-through'}>{s.planName}</span>
                  <span className="text-muted">{s.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <Link href="/portal/admin/clients" className="mono-label mt-8 inline-block text-[10px] text-muted hover:text-gold">
        ← All clients
      </Link>
    </>
  )
}
