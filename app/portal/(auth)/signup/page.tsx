import type { Metadata } from 'next'
import { AuthCard } from '@/components/portal/AuthCard'
import { SignupForm } from '@/components/portal/SignupForm'

export const metadata: Metadata = { title: 'Create Account', robots: { index: false } }

export default function SignupPage() {
  return (
    <AuthCard
      wide
      title={
        <>
          Create Your <em>Account</em>
        </>
      }
      subtitle="Sign up to choose your weekly meals, track your orders and manage deliveries."
    >
      <SignupForm />
    </AuthCard>
  )
}
