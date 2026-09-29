type Props = { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode }

export function PageIntro({ eyebrow, title, children, actions }: Props) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mono-label text-[12px] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-[32px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]">{title}</h1>
        {children && <div className="mt-3 text-[16.5px] leading-relaxed text-muted">{children}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    ACTIVE: 'border-success/40 text-success',
    CONFIRMED: 'border-gold/40 text-gold',
    DELIVERED: 'border-success/40 text-success',
    IN_PREPARATION: 'border-gold/40 text-gold-hover',
    PENDING: 'border-line text-muted',
    PAUSED: 'border-danger/40 text-danger',
    NEW: 'border-gold/40 text-gold',
    CONTACTED: 'border-line text-alabaster',
    CLOSED: 'border-line text-muted',
  }
  return (
    <span className={`mono-label inline-flex items-center rounded-[2px] border px-2 py-1 text-[11.5px] ${tone[status] ?? 'border-line text-muted'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
