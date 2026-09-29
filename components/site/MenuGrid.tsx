'use client'

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { DishView } from '@/lib/portal'
import { MENU_FILTERS } from '@/lib/menu-data'

/** Filterable dish grid for /current-menu (Master Spec §5.0 — filter pills switch the grid state). */
export function MenuGrid({ dishes }: { dishes: DishView[] }) {
  const [filter, setFilter] = useState<string>('All')
  const visible = useMemo(() => (filter === 'All' ? dishes : dishes.filter((d) => d.specs.includes(filter))), [dishes, filter])

  return (
    <>
      <div className="-mx-4 mb-12 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {['All', ...MENU_FILTERS].map((f) => (
          <button key={f} type="button" className="filter-pill" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <motion.ul layout className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((dish) => (
            <motion.li
              key={dish.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lux-card lux-card-hover group flex flex-col overflow-hidden rounded-[4px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
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
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="!font-serif !text-[22px] !leading-[1.25] !tracking-[-0.01em]">{dish.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{dish.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {dish.specs.map((s) => (
                    <span key={s} className="spec-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {visible.length === 0 && <p className="py-16 text-center text-muted">No dishes carry this tag this week.</p>}
    </>
  )
}
