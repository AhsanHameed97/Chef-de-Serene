import type { Metadata } from 'next'
import { AuthCard } from '@/components/portal/AuthCard'
import { SignupForm } from '@/components/portal/SignupForm'

export const metadata: Metadata = { title: 'Request Portal Access', robots: { index: false } }

export default function SignupPage() {
  return (
    <AuthCard
      wide
      eyebrow="Weekly Meal Prep Membership"
      title="Request Portal Access"
      subtitle="Register your household for recurring glassware delivery. Our concierge team reviews every membership—typically within one business day."
    >
      <SignupForm />
    </AuthCard>
  )
}
