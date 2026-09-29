import type { Metadata } from 'next'
import { AuthCard } from '@/components/portal/AuthCard'
import { LoginForm } from '@/components/portal/LoginForm'

export const metadata: Metadata = { title: 'Client Access Portal', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : undefined
  const notice =
    params.error === 'link' ? 'That sign-in link has expired or was already used. Request a fresh one below.' : undefined

  return (
    <AuthCard title="Client Access Portal" subtitle="Enter your private dashboard to curate this week’s glassware allocation.">
      <LoginForm next={next} notice={notice} />
    </AuthCard>
  )
}
