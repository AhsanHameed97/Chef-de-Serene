type Props = { size?: number; className?: string }

/** Minimal "CdS" crest in a gold circular outline (Master Spec §1 footer hotfix). */
export function Monogram({ size = 40, className = '' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-gold font-serif text-gold ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), letterSpacing: '-0.02em' }}
    >
      CdS
    </span>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`font-serif uppercase tracking-[0.3em] text-alabaster ${className}`}>Chef de Serene</span>
}
