import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getClientWeek } from '@/lib/portal'
import { MealSelector } from '@/components/portal/MealSelector'
import { ConfirmedWeek } from '@/components/portal/ConfirmedWeek'
import { planName } from '@/lib/plans'

export const metadata: Metadata = { title: 'This Week', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function DashboardPage({ searchParams }: Props) {
  const user = await requireUser()
  if (user.role === 'ADMIN') redirect('/portal/admin')

  const { welcome } = await searchParams
  const week = await getClientWeek(user)
  const firstName = user.name.split(' ')[0]

  if (week.order) {
    return (
      <ConfirmedWeek
        deliveryLabel={week.deliveryLabel}
        status={week.order.status}
        totalMeals={week.order.totalMeals}
        notes={week.order.notes}
        address={user.address}
        items={week.order.items}
        confirmedAt={week.order.createdAt}
      />
    )
  }

  const lockedReason =
    user.status === 'PENDING'
      ? welcome
        ? `Welcome, ${firstName}. Your membership request is with our concierge team. Preview this week’s menu below—selection unlocks as soon as your household is activated (typically within one business day).`
        : 'Your membership is under review. Preview this week’s menu below—selection unlocks as soon as your household is activated.'
      : user.status === 'PAUSED'
        ? 'Deliveries for your household are currently paused. Contact concierge@chefdeserene.com to resume your weekly allocation.'
        : undefined

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <p className="mono-label text-[10px] text-gold">
          {planName(user.weeklyQuota)} · Delivery {week.deliveryLabel}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-[32px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]">
          Curate this week’s allocation.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Select {user.weeklyQuota} dishes from Chef Dwayne’s rotating menu. Selections close end of day {week.closesLabel} for{' '}
          {week.deliveryLabel} delivery.
        </p>
      </div>
      <div className="mt-8">
        <MealSelector
          dishes={week.menu}
          quota={user.weeklyQuota}
          userId={user.id}
          clientName={user.name}
          deliveryISO={week.deliveryISO}
          deliveryLabel={week.deliveryLabel}
          address={user.address}
          dietaryNotes={user.dietaryNotes}
          lockedReason={lockedReason}
        />
      </div>
    </>
  )
}
