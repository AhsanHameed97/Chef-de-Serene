import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getClientWeek } from '@/lib/portal'
import { MealSelector } from '@/components/portal/MealSelector'
import { ConfirmedWeek } from '@/components/portal/ConfirmedWeek'
import { greetingInLA } from '@/lib/delivery'
import { WeekSummary } from '@/components/portal/WeekSummary'

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
      ? `${welcome ? `Welcome, ${firstName}. ` : ''}Your account is waiting for approval. You can browse this week’s menu now—ordering unlocks as soon as it’s activated (usually within one business day).`
      : user.status === 'PAUSED'
        ? 'Deliveries for your account are paused. Contact concierge@chefdeserene.com to resume.'
        : undefined

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-14">
        <WeekSummary
          greeting={greetingInLA()}
          firstName={firstName}
          subtitle={
            <>
              Choose {user.weeklyQuota} dishes from Chef Dwayne&rsquo;s rotating menu for your {week.deliveryLabel} delivery.
            </>
          }
          stats={[
            { label: 'Next Delivery', value: week.deliveryShort, note: user.address ?? undefined, icon: 'truck' },
            {
              label: 'Selection Closes',
              value: week.closesShort,
              note: week.daysToClose <= 0 ? 'Closes today' : week.daysToClose === 1 ? '1 day left' : `${week.daysToClose} days left`,
              highlight: week.daysToClose <= 1,
              icon: 'clock',
            },
            { label: 'Your Plan', value: `${user.weeklyQuota} meals`, note: 'per week', icon: 'plate' },
          ]}
        />
      </div>
      <div className="mt-10">
        <MealSelector
          dishes={week.menu}
          quota={user.weeklyQuota}
          userId={user.id}
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
