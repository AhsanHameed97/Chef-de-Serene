import { Monogram } from '@/components/Monogram'

type Props = { eyebrow?: string; title: React.ReactNode; subtitle?: string; wide?: boolean; children: React.ReactNode }

export function AuthCard({ eyebrow = 'Chef de Serene', title, subtitle, wide, children }: Props) {
  return (
    <section
      className={`lux-card w-full animate-fade-up rounded-[4px] !bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(14,14,14,0.96))] px-6 py-11 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.9),0_0_90px_-30px_rgba(197,160,89,0.3)] backdrop-blur-sm sm:px-11 ${
        wide ? 'max-w-[640px]' : 'max-w-[440px]'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <Monogram size={44} />
        <p className="mono-label mt-5 text-[12px] tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-[36px] leading-[1.12] tracking-[-0.02em] text-alabaster">{title}</h1>
        {subtitle && <p className="mt-3 max-w-[420px] text-[15.5px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}
