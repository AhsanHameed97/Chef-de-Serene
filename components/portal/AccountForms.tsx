'use client'

import { useActionState } from 'react'
import { setPasswordAction, updateProfileAction } from '@/lib/actions/account'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'

type Profile = { name: string; phone: string; address: string; dietaryNotes: string }

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfileAction, undefined)
  const v = state?.values ?? profile
  const e = state?.errors ?? {}
  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2" noValidate>
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert state={state} />
        </div>
      )}
      <Field label="Full Name" htmlFor="name" error={e.name}>
        <input id="name" name="name" defaultValue={v.name} className="field-input" {...invalid(state, 'name')} />
      </Field>
      <Field label="Direct Phone" htmlFor="phone" error={e.phone}>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className="field-input" {...invalid(state, 'phone')} />
      </Field>
      <Field label="Delivery Address" htmlFor="address" error={e.address} className="sm:col-span-2">
        <input id="address" name="address" defaultValue={v.address} className="field-input" {...invalid(state, 'address')} />
      </Field>
      <Field label="Dietary Parameters" htmlFor="dietaryNotes" optional error={e.dietaryNotes} className="sm:col-span-2">
        <textarea id="dietaryNotes" name="dietaryNotes" rows={3} defaultValue={v.dietaryNotes} className="field-input resize-y" />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving…">Save Household Details</SubmitButton>
      </div>
    </form>
  )
}

export function PasscodeForm({ hasPasscode }: { hasPasscode: boolean }) {
  const [state, formAction] = useActionState(setPasswordAction, undefined)
  const e = state?.errors ?? {}
  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2" noValidate>
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert state={state} />
        </div>
      )}
      <Field label={hasPasscode ? 'New Passcode' : 'Create Passcode'} htmlFor="password" error={e.password} hint="At least 8 characters.">
        <input id="password" name="password" type="password" autoComplete="new-password" className="field-input" {...invalid(state, 'password')} />
      </Field>
      <Field label="Confirm Passcode" htmlFor="confirm" error={e.confirm}>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" className="field-input" {...invalid(state, 'confirm')} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton variant="outline" pendingLabel="Updating…">
          {hasPasscode ? 'Update Passcode' : 'Set Passcode'}
        </SubmitButton>
      </div>
    </form>
  )
}
