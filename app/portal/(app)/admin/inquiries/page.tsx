import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { INQUIRY_TYPE_LABEL, inquiryRows } from '@/lib/inquiry'
import { inquirySchema } from '@/lib/validation'
import { updateInquiryStatusAction } from '@/lib/actions/admin'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'
import { AutoSubmitSelect } from '@/components/admin/AutoSubmitSelect'
import type { InquiryType } from '@/lib/generated/prisma/client'

export const metadata: Metadata = { title: 'Booking Requests', robots: { index: false } }

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'CLOSED', label: 'Closed' },
]

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const params = await searchParams
  const type = params.type === 'MEAL_PREP' || params.type === 'PRIVATE_DINING' ? (params.type as InquiryType) : undefined
  const inquiries = await prisma.inquiry.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <>
      <PageIntro eyebrow="Concierge Admin" title="Booking Requests">
        Requests sent through the booking form on the website.
      </PageIntro>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {[
          { href: '/portal/admin/inquiries', label: 'All', active: !type },
          { href: '/portal/admin/inquiries?type=MEAL_PREP', label: 'Weekly Meal Prep', active: type === 'MEAL_PREP' },
          { href: '/portal/admin/inquiries?type=PRIVATE_DINING', label: 'Private Dining', active: type === 'PRIVATE_DINING' },
        ].map((f) => (
          <Link key={f.label} href={f.href} className="filter-pill" aria-pressed={f.active}>
            {f.label}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <p className="py-20 text-center text-muted">No booking requests yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {inquiries.map((q) => {
            const parsed = inquirySchema.safeParse(q.payloadJson)
            const rows = parsed.success ? inquiryRows(parsed.data).slice(5) : []
            return (
              <li key={q.id} className="rounded-[4px] border border-line bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mono-label text-[11.5px] text-gold">{INQUIRY_TYPE_LABEL[q.type]}</p>
                    <p className="mt-1 font-serif text-[22px] tracking-[-0.01em]">{q.name}</p>
                    <p className="mt-1 text-[14.5px] text-muted">
                      {q.role && <>{q.role} · </>}
                      <a href={`mailto:${q.email}`} className="hover:text-gold">
                        {q.email}
                      </a>{' '}
                      ·{' '}
                      <a href={`tel:${q.phone}`} className="hover:text-gold">
                        {q.phone}
                      </a>
                      {q.location && <> · {q.location}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="mono-label text-[11.5px] text-muted">
                      {q.createdAt.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <form key={q.status} action={updateInquiryStatusAction} className="flex items-center gap-3">
                      <input type="hidden" name="id" value={q.id} />
                      <StatusBadge status={q.status} />
                      <AutoSubmitSelect name="status" label="Request status" defaultValue={q.status} options={STATUS_OPTIONS} />
                    </form>
                  </div>
                </div>
                {rows.length > 0 && (
                  <dl className="mt-5 grid gap-x-8 gap-y-3 border-t border-line pt-4 text-[15px] sm:grid-cols-2">
                    {rows.map(([label, value]) => (
                      <div key={label}>
                        <dt className="mono-label text-[11px] text-muted">{label}</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
