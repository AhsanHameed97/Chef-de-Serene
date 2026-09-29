'use client'

import { useActionState } from 'react'
import { sendLoginLinkAction } from '@/lib/actions/admin'
import { FormAlert, SubmitButton } from '@/components/portal/forms'

export function SendLinkButton({ id }: { id: string }) {
  const [state, formAction] = useActionState(sendLoginLinkAction, undefined)
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="ghost-gold" className="w-full" pendingLabel="Sending…">
        Email a Sign-In Link
      </SubmitButton>
      <FormAlert state={state} />
    </form>
  )
}
