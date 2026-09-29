import { StatusBadge } from '@/components/portal/PageIntro'

type Item = { id: string; quantity: number; menuItem: { title: string; imageUrl: string; category: string } }

type Props = {
  deliveryLabel: string
  status: string
  totalMeals: number
  notes: string | null
  address: string | null
  items: Item[]
  confirmedAt: Date
}

const STEPS = [
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'IN_PREPARATION', label: 'In Preparation' },
  { key: 'DELIVERED', label: 'Delivered' },
]

export function ConfirmedWeek({ deliveryLabel, status, totalMeals, notes, address, items, confirmedAt }: Props) {
  const reached = Math.max(0, STEPS.findIndex((s) => s.key === status))
  return (
    <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-14">
      <section className="animate-fade-up">
        <p className="mono-label text-[12px] text-gold">Selection Confirmed · {deliveryLabel}</p>
        <h1 className="mt-3 max-w-2xl font-serif text-[32px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]">
          Your {totalMeals} meals are confirmed <em>and with the kitchen.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-muted">
          Each dish is prepared clean-label, sealed in glass, and placed discreetly into residence refrigeration on delivery day.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="lux-card lux-card-hover flex items-center gap-4 rounded-[4px] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.menuItem.imageUrl} alt="" className="h-16 w-20 shrink-0 rounded-[2px] object-cover brightness-90" />
              <div className="min-w-0 flex-1">
                <p className="mono-label text-[11px] text-muted">{item.menuItem.category}</p>
                <p className="mt-0.5 truncate font-serif text-[18px] tracking-[-0.01em]">{item.menuItem.title}</p>
              </div>
              <span className="pr-2 font-mono text-[15.5px] text-gold">× {item.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="lux-card h-fit rounded-[4px] p-7 shadow-[0_0_70px_-30px_rgba(197,160,89,0.3)] lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <p className="mono-label text-[12px] text-muted">Delivery Status</p>
          <StatusBadge status={status} />
        </div>
        <ol className="mt-6 space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.key} className="flex items-center gap-4">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[13px] ${
                  i <= reached ? 'border-transparent bg-[image:var(--gold-gradient)] text-obsidian shadow-[0_0_14px_rgba(197,160,89,0.45)]' : 'border-line text-muted'
                }`}
              >
                {i <= reached ? '✓' : i + 1}
              </span>
              <span className={i <= reached ? 'text-alabaster' : 'text-muted'}>{step.label}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-8 space-y-4 border-t border-line pt-6 text-[15px]">
          <div>
            <dt className="mono-label text-[11.5px] text-muted">Delivery Window</dt>
            <dd className="mt-1">{deliveryLabel}</dd>
          </div>
          <div>
            <dt className="mono-label text-[11.5px] text-muted">Address</dt>
            <dd className="mt-1">{address || 'On file with concierge'}</dd>
          </div>
          {notes && (
            <div>
              <dt className="mono-label text-[11.5px] text-muted">Your Note to Chef</dt>
              <dd className="mt-1 text-muted">{notes}</dd>
            </div>
          )}
          <div>
            <dt className="mono-label text-[11.5px] text-muted">Confirmed</dt>
            <dd className="mt-1 text-muted">
              {confirmedAt.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' })} PT
            </dd>
          </div>
        </dl>
        <a href="mailto:concierge@chefdeserene.com" className="btn-outline mt-8 w-full">
          Request a Change
        </a>
      </aside>
    </div>
  )
}
