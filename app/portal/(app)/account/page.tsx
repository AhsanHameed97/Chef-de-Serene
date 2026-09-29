import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth'
import { deliveryDayLabel, planName } from '@/lib/plans'
import { PageIntro, StatusBadge } from '@/components/portal/PageIntro'
import { PasscodeForm, ProfileForm } from '@/components/portal/AccountForms'

export const metadata: Metadata = { title: 'Account', robots: { index: false } }

export default async function AccountPage() {
  const user = await requireUser()
  const isAdmin = user.role === 'ADMIN'

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:py-14">
      <PageIntro eyebrow={isAdmin ? 'Concierge Admin' : 'Client Portal'} title="Account & Household" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[4px] border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="mono-label text-[10px] text-muted">Membership</p>
            <StatusBadge status={user.status} />
          </div>
          <dl className="mt-6 space-y-4 text-[14px]">
            <div>
              <dt className="mono-label text-[9.5px] text-muted">Email</dt>
              <dd className="mt-1 break-all">{user.email}</dd>
            </div>
            {!isAdmin && (
              <>
                <div>
                  <dt className="mono-label text-[9.5px] text-muted">Plan</dt>
                  <dd className="mt-1">{planName(user.weeklyQuota)}</dd>
                </div>
                <div>
                  <dt className="mono-label text-[9.5px] text-muted">Delivery Day</dt>
                  <dd className="mt-1">{deliveryDayLabel(user.deliveryDay)}</dd>
                </div>
              </>
            )}
            <div>
              <dt className="mono-label text-[9.5px] text-muted">Member Since</dt>
              <dd className="mt-1">{user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</dd>
            </div>
          </dl>
          {!isAdmin && (
            <p className="mt-6 border-t border-line pt-5 text-[12.5px] leading-relaxed text-muted">
              To change your weekly allocation or delivery day, contact{' '}
              <a href="mailto:concierge@chefdeserene.com" className="text-gold hover:underline">
                concierge@chefdeserene.com
              </a>
              .
            </p>
          )}
        </aside>

        <div className="space-y-8">
          <section className="rounded-[4px] border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-[22px] tracking-[-0.01em]">Household Details</h2>
            <p className="mb-6 mt-1 text-[13.5px] text-muted">Used by our delivery team and shared only with Chef Dwayne’s kitchen.</p>
            <ProfileForm
              profile={{
                name: user.name,
                phone: user.phone ?? '',
                address: user.address ?? '',
                dietaryNotes: user.dietaryNotes ?? '',
              }}
            />
          </section>
          <section className="rounded-[4px] border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-[22px] tracking-[-0.01em]">Access Passcode</h2>
            <p className="mb-6 mt-1 text-[13.5px] text-muted">
              You can always sign in with a magic link instead—no passcode required.
            </p>
            <PasscodeForm hasPasscode={Boolean(user.passwordHash)} />
          </section>
        </div>
      </div>
    </main>
  )
}
