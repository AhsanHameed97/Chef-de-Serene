import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicMenu } from '@/lib/public-menu'
import { MenuGrid } from '@/components/site/MenuGrid'
import { CtaBanner } from '@/components/site/CtaBanner'

export const metadata: Metadata = {
  title: 'Current Menu',
  description: "This week's rotating menu across private dining and weekly glassware meal prep—filter by Anti-Inflammatory, Low-Glycemic, High Protein and Athletic Recovery.",
}

export const revalidate = 300

export default async function CurrentMenuPage() {
  const { dishes } = await getPublicMenu()
  return (
    <>
      <section className="lux-glow pt-20 sm:pt-28">
        <div className="section-head" data-reveal>
          <p className="mono-label text-[12.5px] text-gold">Live Weekly Menu</p>
          <h1 className="mt-5 mb-4 text-[clamp(40px,5vw,64px)]">
            Rotating Culinary <em>Architecture</em>
          </h1>
          <p className="section-sub">Explore this week&rsquo;s active menu options across private dining and weekly glassware prep.</p>
        </div>
        <MenuGrid dishes={dishes} />
      </section>

      <CtaBanner
        eyebrow="Weekly Meal Prep Members"
        title={
          <>
            Choose from this menu, <em>every week.</em>
          </>
        }
        body="Recurring households select 10 or 14 dishes in the private Client Portal—sealed in glass and placed in residence refrigeration on Monday or Thursday."
        cta="Start Your Meal Plan"
        fork="MEAL_PREP"
        secondary={
          <Link href="/portal/signup" className="btn btn-glass">
            Create an Account
          </Link>
        }
      />
    </>
  )
}
