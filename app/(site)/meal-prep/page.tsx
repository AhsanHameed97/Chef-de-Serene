import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { CtaBanner } from '@/components/site/CtaBanner'
import { InquiryButton } from '@/components/site/InquiryContext'

export const metadata: Metadata = {
  title: 'Weekly Meal Prep',
  description:
    'Executive performance, delivered in glassware. Dietitian-aligned, Michelin-crafted weekly meal prep placed discreetly into residence refrigeration across Los Angeles.',
}

const PROCESS = [
  ['Biometric Alignment', 'Lab data integration with your Registered Dietitian or physician.'],
  ['Bespoke Preparation', 'Clean-label, Michelin-crafted cooking using unrefined oils and organic proteins.'],
  ['Glassware Sealing', 'Zero plastic, zero chemical leaching, packaged in eco-friendly glass containers.'],
  ['In-Fridge Placement', 'Quiet, discreet delivery directly into residence refrigeration.'],
]

const ALLOCATIONS = [
  {
    title: '10 Meals / Week',
    note: 'Weekday lunch & dinner',
    body: 'For principals who dine out or entertain on weekends.',
  },
  {
    title: '14 Meals / Week',
    note: 'Full week, lunch & dinner',
    body: 'The complete protocol—every lunch and dinner handled, seven days a week.',
    featured: true,
  },
  {
    title: 'Custom Allocation',
    note: 'Households & training blocks',
    body: 'Multiple principals, family members or athletic preparation cycles.',
  },
]

const SOURCING = [
  {
    title: 'Wild-Caught & Grass-Fed',
    body: 'Wild-caught seafood and grass-fed, pasture-raised proteins from traceable purveyors—never conventional, never compromised.',
  },
  {
    title: 'Zero Seed Oils',
    body: 'Cooked only with unrefined olive, avocado and coconut oils and grass-fed butter. No canola, soybean or industrial seed oils.',
  },
  {
    title: 'Allergen-Secure Kitchen',
    body: 'Documented allergy protocols, dedicated prep sequencing and labelled glassware to prevent cross-contact.',
  },
]

export default function MealPrepPage() {
  return (
    <>
      <PageHero
        image="/assets/images/hero-estate-kitchen.webp"
        imageAlt="Clean-label dishes in glass containers with bamboo lids on a dark slate estate kitchen island"
        tag="Recurring Clinical Delivery"
        title={
          <>
            Executive Performance. <em>Delivered in Glassware.</em>
          </>
        }
        subtitle="Precision nutrition engineered to eliminate decision fatigue and fuel high-output lifestyles."
      >
        <InquiryButton fork="MEAL_PREP" className="btn btn-solid-gold">
          Start Your Meal Plan
        </InquiryButton>
        <Link href="/current-menu" className="btn btn-glass">
          View This Week&rsquo;s Menu
        </Link>
      </PageHero>

      {/* ---------- Process ---------- */}
      <section className="lux-glow pt-[var(--section-gap)]">
        <div className="section-head" data-reveal>
          <p className="mono-label text-[12.5px] text-gold">The Protocol</p>
          <h2 className="mt-4">
            From Bloodwork to <em>Your Refrigerator</em>
          </h2>
        </div>
        <ol className="mx-auto grid max-w-[1320px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map(([title, body], i) => (
            <li
              key={title}
              data-reveal
              data-reveal-delay={i * 90}
              className="lux-card lux-card-hover group relative rounded-[4px] p-8"
            >
              <span className="font-serif text-[44px] leading-none text-gold/80">0{i + 1}</span>
              <span className="mt-6 block h-px w-10 bg-gold/50 transition-all duration-500 group-hover:w-20" />
              <h3 className="mt-6 !font-sans !text-[20px] !font-medium !tracking-normal">{title}</h3>
              <p className="mt-2.5 text-[16px] leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Allocations ---------- */}
      <section>
        <div className="section-head" data-reveal>
          <p className="mono-label text-[12.5px] text-gold">Weekly Allocation</p>
          <h2 className="mt-4">
            Choose Your <em>Meal Plan</em>
          </h2>
          <p className="section-sub">Delivered Monday or Thursday—up to two deliveries per week.</p>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
          {ALLOCATIONS.map((a, i) => (
            <div
              key={a.title}
              data-reveal
              data-reveal-delay={i * 90}
              className={`lux-card lux-card-hover flex flex-col rounded-[4px] p-9 ${a.featured ? '!border-gold/70 shadow-[0_0_60px_-20px_rgba(197,160,89,0.35)]' : ''}`}
            >
              <p className="mono-label text-[12px] text-muted">{a.note}</p>
              <h3 className="mt-3 text-[30px]">{a.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{a.body}</p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[15.5px]">
                <li>RD-aligned macros on every dish</li>
                <li>Weekly selection in the Client Portal</li>
                <li>Eco glassware with bamboo lids</li>
              </ul>
              <InquiryButton fork="MEAL_PREP" className={`btn mt-8 ${a.featured ? 'btn-solid-gold' : 'btn-outline-gold'}`}>
                Choose {a.title.replace(' / Week', '')}
              </InquiryButton>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Sourcing ---------- */}
      <section>
        <div className="section-head" data-reveal>
          <p className="mono-label text-[12.5px] text-gold">Sourcing &amp; Quality</p>
          <h2 className="mt-4">
            Nothing Plastic. <em>Nothing Processed.</em>
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3" data-reveal>
          {SOURCING.map((s, i) => (
            <div key={s.title} className="bg-obsidian p-8 md:p-10">
              <span className="mono-label text-[12px] text-gold">0{i + 1}</span>
              <h3 className="mt-4 text-[26px]">{s.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Client portal ---------- */}
      <section>
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2" data-reveal>
          <div>
            <p className="mono-label text-[12.5px] text-gold">For Recurring Clients</p>
            <h2 className="mt-4 text-[clamp(34px,3.8vw,50px)]">
              Your week, curated in <em>your account.</em>
            </h2>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-muted">
              Members sign in to a private dashboard, choose their dishes from the rotating menu and confirm—your selection reaches Chef
              Dwayne&rsquo;s kitchen instantly.
            </p>
            <ul className="mt-6 space-y-3 text-[16.5px]">
              {['Select 10 or 14 dishes with full macros', 'Confirm by the cutoff for Monday or Thursday delivery', 'Instant confirmation to you and the kitchen'].map(
                (t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {t}
                  </li>
                ),
              )}
            </ul>
            <Link href="/portal/login" className="btn btn-outline-gold mt-8">
              Client Portal Login &rarr;
            </Link>
          </div>
          <div aria-hidden="true" className="lux-card rounded-[4px] p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_70px_-25px_rgba(197,160,89,0.25)]">
            <div className="flex items-baseline justify-between">
              <span className="mono-label text-[11.5px] text-muted">Weekly Allocation Status</span>
              <span className="mono-label text-[12px] text-gold">12 / 14 Meals Selected</span>
            </div>
            <div className="mt-2 h-[3px] rounded-full bg-line">
              <div className="h-full w-[86%] rounded-full bg-gold" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Wild King Salmon Crudo', 2],
                ['Grass-Fed Bison Tenderloin', 3],
                ['Pacific Halibut', 2],
                ['Heirloom Beet Salad', 1],
              ].map(([t, n]) => (
                <div key={t} className="rounded-[2px] border border-line bg-obsidian p-3">
                  <p className="truncate text-[14.5px]">{t}</p>
                  <div className="mt-3 flex items-center justify-between rounded-[2px] border border-gold/40 px-2 py-1 font-mono text-[13.5px] text-gold">
                    <span>−</span>
                    <span className="text-alabaster">{n}</span>
                    <span>+</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-[13.5px] text-muted">Delivery: Monday</span>
              <span className="rounded-[2px] bg-gold/40 px-3 py-2 text-[13px] font-semibold text-obsidian">Confirm Weekly Selection →</span>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Weekly Meal Prep"
        title={
          <>
            Start Your <em>Weekly Meal Plan</em>
          </>
        }
        body="Choose your meals per week, delivery days and dietary needs. We’ll confirm within one business day."
        cta="Start Your Meal Plan"
        fork="MEAL_PREP"
      />
    </>
  )
}
