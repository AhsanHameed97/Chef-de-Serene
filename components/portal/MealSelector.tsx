'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DishView } from '@/lib/portal'
import { MENU_FILTERS } from '@/lib/menu-data'

type Props = {
  dishes: DishView[]
  quota: number
  userId: string
  deliveryISO: string
  deliveryLabel: string
  address: string | null
  dietaryNotes: string | null
  /** When set, the menu is visible but selection is disabled. */
  lockedReason?: string
}

type Counts = Record<string, number>

const sum = (c: Counts) => Object.values(c).reduce((a, b) => a + b, 0)

export function MealSelector(props: Props) {
  const { dishes, quota, userId, deliveryISO, lockedReason } = props
  const router = useRouter()
  const draftKey = `cds-draft:${userId}:${deliveryISO}`

  const [counts, setCounts] = useState<Counts>({})
  const [hydrated, setHydrated] = useState(false)
  const [filter, setFilter] = useState<string>('All')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore an unconfirmed draft for this delivery week (per-browser convenience).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) || '{}') as Counts
      const valid = new Set(dishes.map((d) => d.id))
      const restored: Counts = {}
      let running = 0
      for (const [id, qty] of Object.entries(saved)) {
        if (!valid.has(id) || !Number.isInteger(qty) || qty < 1) continue
        const take = Math.min(qty, quota - running)
        if (take > 0) {
          restored[id] = take
          running += take
        }
      }
      setCounts(restored)
    } catch {
      /* storage unavailable — start fresh */
    }
    setHydrated(true)
  }, [draftKey, dishes, quota])

  useEffect(() => {
    if (!hydrated) return
    try {
      if (sum(counts) > 0) localStorage.setItem(draftKey, JSON.stringify(counts))
      else localStorage.removeItem(draftKey)
    } catch {
      /* ignore */
    }
  }, [counts, hydrated, draftKey])

  useEffect(() => {
    if (!reviewOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !submitting && setReviewOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [reviewOpen, submitting])

  const total = sum(counts)
  const remaining = quota - total
  const locked = Boolean(lockedReason)
  const pct = Math.min(100, (total / quota) * 100)

  const filters = useMemo(() => {
    const present = new Set(dishes.flatMap((d) => d.specs))
    return ['All', ...MENU_FILTERS.filter((f) => present.has(f))]
  }, [dishes])

  const visible = filter === 'All' ? dishes : dishes.filter((d) => d.specs.includes(filter))
  const selected = dishes.filter((d) => counts[d.id] > 0)

  function add(id: string) {
    if (locked) return
    setCounts((c) => (sum(c) >= quota ? c : { ...c, [id]: (c[id] ?? 0) + 1 }))
  }
  function remove(id: string) {
    setCounts((c) => {
      const next = { ...c }
      if ((next[id] ?? 0) <= 1) delete next[id]
      else next[id] -= 1
      return next
    })
  }

  async function confirm() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: Object.entries(counts).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
          notes: notes.trim() || undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok && res.status !== 409) throw new Error(data.error || 'We could not confirm your selection. Please try again.')
      if (res.status === 409 && !/already confirmed/i.test(data.error ?? '')) throw new Error(data.error)
      try {
        localStorage.removeItem(draftKey)
      } catch {
        /* ignore */
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ---------- Sticky allocation status ---------- */}
      <div className="sticky top-[105px] z-30 border-y border-line bg-[#0f0f0f]/95 backdrop-blur-md md:top-16">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3.5 sm:gap-8 sm:px-6">
          <div className="shrink-0">
            <p className="mono-label hidden text-[11px] text-muted sm:block">Weekly Allocation</p>
            <p className="flex items-baseline gap-1.5" aria-live="polite">
              <span className="gold-text font-serif text-[30px] leading-none">{total}</span>
              <span className="font-serif text-[18px] text-muted">/ {quota}</span>
              <span className="mono-label ml-1.5 text-[11px] text-muted">meals selected</span>
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-[5px] overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-luxe"
                style={{ width: `${pct}%`, background: 'var(--gold-gradient)', boxShadow: pct > 0 ? '0 0 12px rgba(197,160,89,0.5)' : undefined }}
              />
            </div>
            <p className="mt-1.5 hidden text-[12.5px] text-muted sm:block">
              {remaining === 0 ? 'All meals chosen — review and confirm below.' : `${remaining} more ${remaining === 1 ? 'meal' : 'meals'} to choose`}
            </p>
          </div>
          <div className="hidden shrink-0 text-right md:block">
            <p className="mono-label text-[11px] text-muted">Delivery Window</p>
            <p className="mt-1 text-[15px] text-alabaster">{props.deliveryLabel}</p>
          </div>
        </div>
      </div>

      <div className={`mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 ${total > 0 ? 'pb-44' : 'pb-24'}`}>
        {lockedReason && (
          <div className="mb-8 rounded-[2px] border border-gold/30 bg-gold/[0.05] px-5 py-4 text-[15.5px] text-alabaster">{lockedReason}</div>
        )}

        {/* ---------- Filters ---------- */}
        <div className="-mx-4 mb-8 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => (
            <button key={f} type="button" className="filter-pill" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* ---------- Dish grid ---------- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              count={counts[dish.id] ?? 0}
              canAdd={!locked && total < quota}
              locked={locked}
              onAdd={() => add(dish.id)}
              onRemove={() => remove(dish.id)}
            />
          ))}
        </div>
        {visible.length === 0 && <p className="py-16 text-center text-muted">No dishes match this filter this week.</p>}
      </div>

      {/* ---------- Bottom sticky action drawer ---------- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md transition-transform duration-500 ease-luxe ${
          total > 0 ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
        aria-hidden={total === 0}
      >
        {drawerOpen && selected.length > 0 && (
          <ul className="mx-auto max-h-[38vh] max-w-[1400px] divide-y divide-line overflow-y-auto border-b border-line px-4 sm:px-6">
            {selected.map((d) => (
              <li key={d.id} className="flex items-center gap-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.imageUrl} alt="" className="h-10 w-12 rounded-[2px] object-cover" />
                <span className="flex-1 truncate text-[15.5px]">{d.title}</span>
                <Stepper count={counts[d.id]} canAdd={total < quota} onAdd={() => add(d.id)} onRemove={() => remove(d.id)} compact />
              </li>
            ))}
          </ul>
        )}
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="mono-label text-[13px] text-gold">
              {total} of {quota} Meals Allocated
            </p>
            <p className="mt-1 truncate text-[14px] text-muted">
              Delivery Address: <span className="text-alabaster/90">{props.address || 'On file with concierge'}</span>
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => setDrawerOpen((o) => !o)} className="mono-label text-[12px] text-muted hover:text-alabaster">
              {drawerOpen ? 'Hide' : 'View'} Selection ({selected.length})
            </button>
            <button type="button" onClick={() => setCounts({})} className="mono-label text-[12px] text-muted hover:text-danger">
              Clear
            </button>
          </div>
          <div className="ml-auto flex w-full items-center justify-end gap-4 sm:w-auto">
            {remaining > 0 && (
              <span className="hidden text-[14px] text-muted sm:inline">
                Select {remaining} more {remaining === 1 ? 'meal' : 'meals'}
              </span>
            )}
            <button type="button" className="btn-gold w-full sm:w-auto" disabled={total !== quota || locked} onClick={() => setReviewOpen(true)}>
              Confirm Weekly Selection &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Review & confirm modal ---------- */}
      {reviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-obsidian/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={(e) => e.target === e.currentTarget && !submitting && setReviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="max-h-[92vh] w-full max-w-[560px] animate-fade-up overflow-y-auto rounded-t-[4px] border border-line bg-surface p-6 sm:rounded-[4px] sm:p-9"
          >
            <p className="mono-label text-[12px] text-gold">Review Selection · {props.deliveryLabel}</p>
            <h2 id="review-title" className="mt-3 font-serif text-[28px] leading-tight tracking-[-0.01em]">
              Confirm {quota} meals for delivery
            </h2>
            <p className="mt-2 text-[15.5px] text-muted">Selections lock once confirmed and are sent directly to Chef Dwayne’s kitchen.</p>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {selected.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3 text-[15.5px]">
                  <span>{d.title}</span>
                  <span className="font-mono text-[14.5px] text-gold">× {counts[d.id]}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 grid gap-3 text-[14.5px]">
              <div className="flex gap-3">
                <dt className="mono-label w-28 shrink-0 pt-0.5 text-[11.5px] text-muted">Deliver to</dt>
                <dd>{props.address || 'On file with concierge'}</dd>
              </div>
              {props.dietaryNotes && (
                <div className="flex gap-3">
                  <dt className="mono-label w-28 shrink-0 pt-0.5 text-[11.5px] text-muted">Dietary</dt>
                  <dd className="text-muted">{props.dietaryNotes}</dd>
                </div>
              )}
            </dl>

            <label htmlFor="order-notes" className="mono-label mt-6 block text-[11.5px] text-muted">
              Note to Chef <span className="normal-case tracking-normal opacity-60">(optional)</span>
            </label>
            <textarea
              id="order-notes"
              rows={2}
              maxLength={1000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Substitutions, guests this week, timing preferences…"
              className="field-input mt-2 resize-y"
            />

            {error && (
              <p role="alert" className="mt-5 rounded-[2px] border border-danger/40 bg-danger/[0.07] px-4 py-3 text-[15px] text-danger">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="btn-outline" disabled={submitting} onClick={() => setReviewOpen(false)}>
                Keep Editing
              </button>
              <button type="button" className="btn-gold" disabled={submitting} onClick={confirm} aria-busy={submitting}>
                {submitting ? 'Sending to Kitchen…' : 'Confirm & Send to Kitchen →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DishCard({
  dish,
  count,
  canAdd,
  locked,
  onAdd,
  onRemove,
}: {
  dish: DishView
  count: number
  canAdd: boolean
  locked: boolean
  onAdd: () => void
  onRemove: () => void
}) {
  const macros = [
    ['kcal', dish.calories],
    ['Protein', dish.proteinG != null ? `${dish.proteinG}g` : null],
    ['Carbs', dish.carbsG != null ? `${dish.carbsG}g` : null],
    ['Fat', dish.fatG != null ? `${dish.fatG}g` : null],
  ].filter(([, v]) => v != null) as [string, string | number][]

  return (
    <article
      className={`lux-card lux-card-hover group flex flex-col overflow-hidden rounded-[4px] ${count > 0 ? '!border-gold/60 shadow-[0_0_50px_-20px_rgba(197,160,89,0.35)]' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.imageUrl}
          alt={dish.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover brightness-[0.82] transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
        />
        <span className="mono-label absolute left-3 top-3 rounded-[2px] bg-obsidian/70 px-2 py-1 text-[11px] text-alabaster/85 backdrop-blur">
          {dish.category}
        </span>
        {count > 0 && (
          <span className="mono-label absolute right-3 top-3 rounded-[2px] bg-gold px-2 py-1 text-[12px] text-obsidian">× {count}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[21px] leading-[1.25] tracking-[-0.01em]">{dish.title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{dish.description}</p>

        {macros.length > 0 && (
          <dl className="mt-4 grid grid-cols-4 border-y border-line py-3 text-center">
            {macros.map(([label, value]) => (
              <div key={label}>
                <dt className="mono-label text-[11px] text-muted">{label}</dt>
                <dd className="mt-0.5 font-mono text-[14.5px] text-alabaster">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {dish.specs.map((s) => (
            <span key={s} className="spec-tag">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          {count === 0 ? (
            <button type="button" className="btn-outline w-full" disabled={!canAdd} onClick={onAdd}>
              {locked ? 'Selection Locked' : '+ Add to Delivery'}
            </button>
          ) : (
            <Stepper count={count} canAdd={canAdd} onAdd={onAdd} onRemove={onRemove} />
          )}
        </div>
      </div>
    </article>
  )
}

function Stepper({
  count,
  canAdd,
  onAdd,
  onRemove,
  compact,
}: {
  count: number
  canAdd: boolean
  onAdd: () => void
  onRemove: () => void
  compact?: boolean
}) {
  const size = compact ? 'h-8 w-9' : 'h-[46px] w-14'
  return (
    <div className={`flex items-center rounded-[2px] border border-gold/50 ${compact ? '' : 'w-full'}`}>
      <button type="button" aria-label="Remove one" onClick={onRemove} className={`${size} text-lg text-gold transition-colors hover:bg-gold/10`}>
        −
      </button>
      <span className={`flex-1 text-center font-mono text-[15.5px] ${compact ? 'w-8' : ''}`}>{count}</span>
      <button
        type="button"
        aria-label="Add one"
        onClick={onAdd}
        disabled={!canAdd}
        className={`${size} text-lg text-gold transition-colors hover:bg-gold/10 disabled:opacity-30`}
      >
        +
      </button>
    </div>
  )
}
