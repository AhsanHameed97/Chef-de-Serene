type Stat = { label: string; value: string; note?: string; highlight?: boolean; icon: 'truck' | 'clock' | 'plate' }

function Icon({ name }: { name: Stat['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      {name === 'truck' && (
        <g {...common}>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="17.5" r="1.6" />
          <circle cx="17" cy="17.5" r="1.6" />
        </g>
      )}
      {name === 'clock' && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </g>
      )}
      {name === 'plate' && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
        </g>
      )}
    </svg>
  )
}

/** Greeting + at-a-glance cards at the top of the client dashboard. */
export function WeekSummary({ greeting, firstName, subtitle, stats }: { greeting: string; firstName: string; subtitle: React.ReactNode; stats: Stat[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr] lg:items-end">
      <div className="animate-fade-up">
        <p className="mono-label flex items-center gap-3 text-[12px] text-gold before:h-px before:w-8 before:bg-gold/60">Client Portal</p>
        <h1 className="mt-4 font-serif text-[38px] leading-[1.1] tracking-[-0.02em] sm:text-[48px]">
          {greeting}, <em>{firstName}.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-muted">{subtitle}</p>
      </div>
      <dl className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`lux-card min-w-0 rounded-[4px] p-3 sm:p-5 ${s.highlight ? '!border-gold/45' : ''}`}>
            <dt className="flex items-start justify-between gap-2">
              <span className="mono-label text-[9.5px] leading-snug text-muted sm:text-[11px]">{s.label}</span>
              <span className="hidden h-8 w-8 shrink-0 sm:flex items-center justify-center rounded-full border border-gold/30 text-gold">
                <Icon name={s.icon} />
              </span>
            </dt>
            <dd className="mt-2.5 font-serif text-[18px] leading-tight tracking-[-0.01em] text-alabaster sm:mt-4 sm:text-[24px]">{s.value}</dd>
            {s.note && <dd className={`mt-1 truncate text-[12px] sm:text-[13.5px] ${s.highlight ? 'text-gold' : 'text-muted'}`}>{s.note}</dd>}
          </div>
        ))}
      </dl>
    </div>
  )
}
