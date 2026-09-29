/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { CtaBanner } from '@/components/site/CtaBanner'

export const metadata: Metadata = {
  title: 'Philosophy & Pedigree',
  description:
    'Chef Dwayne Childress: Ohio State culinary and dietary science, ACF credentials and classical training in Paris, Nice and Sicily—combined with Registered Dietitian clinical integration.',
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`

const CHAPTERS = [
  {
    n: '01',
    eyebrow: 'Culinary Foundations',
    title: 'A classical education, carried into the private kitchen.',
    image: unsplash('1551218808-94e220e084d2'),
    imageAlt: 'Chef’s hands executing precise knife work',
    body: [
      'Chef Dwayne Childress built his craft on fundamentals: formal culinary and dietary science education at The Ohio State University, credentialing through the American Culinary Federation, and classical training in Paris, Nice and Sicily.',
      'That foundation is French and Mediterranean at its core—precise knife work, patient stocks and sauces, seasonal produce treated with restraint. It is the discipline that gives every plate, and every sealed glass container, its composure.',
    ],
    specs: ['Ohio State · Culinary & Dietary Science', 'ACF Credentialed', 'Paris · Nice · Sicily'],
  },
  {
    n: '02',
    eyebrow: 'The Clinical RD Integration',
    title: 'Fine dining alone creates health gaps.',
    image: unsplash('1540189549336-e6e99c3679fe'),
    imageAlt: 'Anti-inflammatory salad of bitter greens and heirloom beets',
    body: [
      'Butter-forward sauces, refined starches and generous portions are designed for one memorable evening—not for the tenth meal of a demanding week. Over time, that gap shows up in energy, inflammation and bloodwork.',
      'Chef de Serene closes it through a direct co-authoring partnership with Licensed Registered Dietitians. Lab work, food sensitivities and metabolic targets become macro and micronutrient parameters, and those parameters are written into the menu itself—before a single ingredient is ordered.',
    ],
    quote: 'Food a principal genuinely looks forward to—that quietly moves every biomarker in the right direction.',
    specs: ['Bloodwork & physician notes', 'RD macro & micronutrient targets', 'Chef’s menu architecture', 'Weekly review & refinement'],
  },
  {
    n: '03',
    eyebrow: 'Discretion as a Core Value',
    title: 'The kitchen is the most intimate room in the house.',
    image: unsplash('1517248135467-4c7edcad34c4'),
    imageAlt: 'Quiet, low-lit private dining room',
    body: [
      'Estate managers and high-profile households trust Chef de Serene because privacy is not a courtesy here—it is the operating standard.',
      'Engagements can begin under a standard or principal-provided NDA. Every team member is background-cleared, never photographs residences, guests or family, and reports directly to the Chief of Staff or Estate Manager. Nothing about your household ever becomes content.',
    ],
    specs: ['NDA prior to entry', 'Background-cleared team', 'Zero digital footprint'],
  },
]

export default function PhilosophyPage() {
  return (
    <>
      <section className="pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1200px] border-b border-line pb-16" data-reveal>
          <p className="mono-label text-[10.5px] text-gold">The Philosophy &amp; Pedigree</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(42px,6vw,84px)] leading-[1.05]">Michelin discipline. Clinical purpose.</h1>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <p className="text-[19px] leading-relaxed text-alabaster/90">
              Chef de Serene exists for households that refuse to choose between extraordinary food and long-term health.
            </p>
            <p className="text-[16px] leading-relaxed text-muted">
              Every menu is authored twice—once by a classically trained chef, and once by a licensed Registered Dietitian—then executed
              with the discretion that private estates require.
            </p>
          </div>
        </div>
      </section>

      {CHAPTERS.map((c, i) => (
        <section key={c.n}>
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:gap-20">
            <div className={`lg:sticky lg:top-28 lg:h-fit ${i % 2 === 1 ? 'lg:order-2' : ''}`} data-reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-line">
                <img src={c.image} alt={c.imageAlt} loading="lazy" className="h-full w-full object-cover brightness-[0.78] contrast-[1.05]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/90 to-transparent" />
                <span className="absolute bottom-5 left-6 font-serif text-[64px] leading-none text-alabaster/80">{c.n}</span>
              </div>
            </div>

            <article className="flex flex-col justify-center" data-reveal>
              <p className="mono-label text-[10.5px] text-gold">
                Chapter {c.n} · {c.eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(32px,3.4vw,46px)]">{c.title}</h2>
              <div className="mt-8 space-y-5 text-[16.5px] leading-[1.75] text-muted">
                {c.body.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              {c.quote && (
                <blockquote className="mt-10 border-l border-gold pl-6 font-serif text-[26px] leading-snug tracking-[-0.02em] text-alabaster">
                  &ldquo;{c.quote}&rdquo;
                </blockquote>
              )}
              <ul className="mt-10 flex flex-wrap gap-2">
                {c.specs.map((s) => (
                  <li key={s} className="spec-tag !py-2">
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ))}

      <CtaBanner
        eyebrow="Begin"
        title="Experience the philosophy at your table."
        body="Private estate dining or weekly glassware meal prep—start with a 60-second confidential inquiry."
        cta="Begin a Confidential Inquiry"
      />
    </>
  )
}
