import { InquiryButton } from '@/components/site/InquiryContext'
import type { Fork } from '@/components/site/InquiryWizard'

type Props = { eyebrow: string; title: string; body: string; cta: string; fork?: Fork; secondary?: React.ReactNode }

export function CtaBanner({ eyebrow, title, body, cta, fork, secondary }: Props) {
  return (
    <section>
      <div
        className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[4px] border border-gold/25 bg-surface px-6 py-16 text-center sm:px-12 sm:py-20"
        data-reveal
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,rgba(197,160,89,0.14),transparent_70%)]"
        />
        <div className="relative">
          <p className="mono-label text-[10.5px] text-gold">{eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(30px,3.6vw,48px)]">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-muted">{body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <InquiryButton fork={fork} className="btn btn-solid-gold">
              {cta} &rarr;
            </InquiryButton>
            {secondary}
          </div>
        </div>
      </div>
    </section>
  )
}
