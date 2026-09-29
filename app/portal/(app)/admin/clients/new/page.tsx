import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/portal/PageIntro'
import { ClientForm } from '@/components/admin/ClientForm'

export const metadata: Metadata = { title: 'Add Client', robots: { index: false } }

export default function NewClientPage() {
  return (
    <>
      <PageIntro eyebrow="Concierge Admin" title="Add Client Household">
        Onboard an existing recurring client directly. They sign in with a magic link—no passcode needed.
      </PageIntro>
      <div className="mt-8 max-w-3xl rounded-[4px] border border-line bg-surface p-6 sm:p-8">
        <ClientForm
          mode="create"
          initial={{ email: '', name: '', phone: '', address: '', deliveryDay: 'MONDAY', weeklyQuota: '14', status: 'ACTIVE', dietaryNotes: '' }}
        />
      </div>
      <Link href="/portal/admin/clients" className="mono-label mt-6 inline-block text-[10px] text-muted hover:text-gold">
        ← All clients
      </Link>
    </>
  )
}
