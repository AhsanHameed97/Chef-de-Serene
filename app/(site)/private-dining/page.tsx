import type { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'
import { CtaBanner } from '@/components/site/CtaBanner'
import { InquiryButton } from '@/components/site/InquiryContext'

export const metadata: Metadata = {
  title: 'Private Dining & Estate Hospitality',
  description:
    'Michelin-star craft for private estates: in-residence retainers, bespoke tasting menus and seasonal travel coverage—under NDA, with zero digital footprint.',
}

const MODULES = [
  {
    numeral: 'I',
    title: 'In-Residence Estate Retainers',
    body: 'Dedicated daily culinary operations for primary residences.',
    points: ['Household staff coordination', 'Daily menu curation', 'Pantry & provisioning management'],
  },
  {
    numeral: 'II',
    title: 'Bespoke Tasting Menus & Events',
    body: 'Multi-course fine dining for private intimate gatherings, corporate boards, and estate galas.',
    points: ['Three to twelve courses', 'Tasting or family-style service', 'Wine service coordination'],
  },
  {
    numeral: 'III',
    title: 'Seasonal & Travel Retainers',
    body: 'Complete culinary coverage for yacht charters, summer and winter estates, and aviation dining.',
    points: ['Yacht charters', 'Aspen · Miami · Europe', 'Aviation dining'],
  },
]

const DISCRETION = [
  ['NDA Compliant', 'Standard or principal-provided confidentiality agreements signed prior to entry.'],
  ['Background Cleared', 'Fully vetted culinary team adhering to estate security protocols.'],
  ['Zero Digital Footprint', 'Ironclad guarantee against taking or sharing photos of private residences.'],
  ['Staff Aligned', 'Direct daily reporting to Chiefs of Staff and Household Estate Managers.'],
]

const PROCESS = [
  ['Confidential Inquiry', 'A 60-second brief. Where requested, an NDA is executed before any household details are shared.'],
  ['Private Consultation', 'A direct conversation with Chef Dwayne on guests, dietary protocols, anchor proteins and service style.'],
  ['Menu Architecture', 'Proposed menus refined back-and-forth with you until every course is exactly right.'],
  ['Flawless Execution', 'Sourcing, kitchen, service and clean-down handled end to end by a vetted team.'],
]

export default function PrivateDiningPage() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Intimate candlelit estate dining tablescape with wine service and plated courses"
        tag="Full Residence Retainers"
        title="Michelin-Star Craft for Private Estates."
        subtitle="Turnkey culinary management, tasting menus, and travel coverage for global residences."
      >
        <InquiryButton fork="PRIVATE_DINING" className="btn btn-solid-gold">
          Request Private Dining Inquiry
        </InquiryButton>
        <a href="#services" className="btn btn-glass">
          Explore Services
        </a>
      </PageHero>

      {/* ---------- Service modules ---------- */}
      <section id="services" className="scroll-mt-24 pt-[var(--section-gap)]">
        <div className="section-head" data-reveal>
          <p className="mono-label text-[10.5px] text-gold">Service Architecture</p>
          <h2 className="mt-4">Three Ways We Serve the Estate</h2>
        </div>
        <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <article
              key={m.title}
              data-reveal
              data-reveal-delay={i * 100}
              className="group relative flex flex-col overflow-hidden rounded-[4px] border border-line bg-surface p-8 transition-colors duration-500 hover:border-gold/60 sm:p-10"
            >
              <span aria-hidden="true" className="absolute -right-2 -top-6 font-serif text-[140px] leading-none text-alabaster/[0.04]">
                {m.numeral}
              </span>
              <p className="mono-label text-[10px] text-gold">Module {m.numeral}</p>
              <h3 className="mt-5 text-[30px]">{m.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{m.body}</p>
              <ul className="mt-auto space-y-3 border-t border-line pt-6 text-[14px]">
                {m.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Discretion bar ---------- */}
      <section>
        <div className="section-head" data-reveal>
          <p className="mono-label text-[10.5px] text-gold">Household Security &amp; Discretion</p>
          <h2 className="mt-4">Trusted Inside the Most Private Homes</h2>
        </div>
        <div className="mx-auto grid max-w-[1320px] gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {DISCRETION.map(([title, body]) => (
            <div key={title} className="bg-obsidian p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                <svg viewBox="0 0 40 40" fill="none" className="h-[18px] w-[18px]">
                  <path d="M20 5 L32 10 V19 C32 27 27 32.5 20 35 C13 32.5 8 27 8 19 V10 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M14.5 19.5 L18 23 L26 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mono-label mt-6 text-[11px] text-alabaster">{title}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Engagement process ---------- */}
      <section>
        <div className="section-head" data-reveal>
          <p className="mono-label text-[10.5px] text-gold">The Engagement</p>
          <h2 className="mt-4">How a Private Menu Comes Together</h2>
        </div>
        <ol className="mx-auto max-w-[980px] border-t border-line" data-reveal>
          {PROCESS.map(([title, body], i) => (
            <li key={title} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[80px_260px_1fr] sm:gap-8">
              <span className="font-serif text-[32px] leading-none text-gold/70">0{i + 1}</span>
              <h3 className="text-[24px]">{title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBanner
        eyebrow="Private Estate Dining"
        title="Request Private Dining Inquiry"
        body="Share the occasion, party size and target date. A concierge responds within one business day via a secure channel."
        cta="Request Private Dining Inquiry"
        fork="PRIVATE_DINING"
      />
    </>
  )
}
