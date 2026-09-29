import { Monogram } from '@/components/Monogram'

type Props = { eyebrow?: string; title: string; subtitle?: string; wide?: boolean; children: React.ReactNode }

export function AuthCard({ eyebrow = 'Chef de Serene', title, subtitle, wide, children }: Props) {
  return (
    <section
      className={`w-full animate-fade-up rounded-[4px] border border-line bg-surface/95 px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:px-10 ${
        wide ? 'max-w-[640px]' : 'max-w-[440px]'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <Monogram size={44} />
        <p className="mono-label mt-5 text-[10px] tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-alabaster">{title}</h1>
        {subtitle && <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}
