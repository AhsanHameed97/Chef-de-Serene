import type { Metadata } from 'next'
import { AuthCard } from '@/components/portal/AuthCard'
import { LoginForm } from '@/components/portal/LoginForm'

export const metadata: Metadata = { title: 'Sign In', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : undefined
  const notice =
    params.error === 'link' ? 'That sign-in link has expired or was already used. Request a fresh one below.' : undefined

  return (
    <AuthCard
      title={
        <>
          Welcome <em>Back</em>
        </>
      } subtitle="Sign in to choose your meals and manage your deliveries.">
      <LoginForm next={next} notice={notice} />
    </AuthCard>
  )
}
