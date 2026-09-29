import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthCard } from '@/components/portal/AuthCard'
import { SubmitButton } from '@/components/portal/forms'
import { peekMagicLink } from '@/lib/auth'
import { verifyMagicLinkAction } from '@/lib/actions/auth'

export const metadata: Metadata = { title: 'Confirm Sign-In', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams
  const token = typeof params.token === 'string' ? params.token : ''
  const next = typeof params.next === 'string' ? params.next : ''
  const user = token ? await peekMagicLink(token) : null

  if (!user) {
    return (
      <AuthCard title="Link Expired" subtitle="This sign-in link has expired or was already used. Links are valid for 20 minutes and work once.">
        <Link href="/portal/login" className="btn-gold w-full">
          Request a New Link &rarr;
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Confirm Sign-In" subtitle={`Continue as ${user.name} (${user.email}).`}>
      <form action={verifyMagicLinkAction}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="next" value={next} />
        <SubmitButton className="w-full" pendingLabel="Entering…">
          Enter Private Dashboard &rarr;
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-[12.5px] text-muted">
        Not you?{' '}
        <Link href="/portal/login" className="text-gold hover:underline">
          Return to sign-in
        </Link>
      </p>
    </AuthCard>
  )
}
