'use client'

import { useActionState } from 'react'
import { createClientAction, updateClientAction } from '@/lib/actions/admin'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'

export type ClientFormValues = {
  id?: string
  email?: string
  name: string
  phone: string
  address: string
  deliveryDay: string
  weeklyQuota: string
  status: string
  dietaryNotes: string
}

export function ClientForm({ initial, mode }: { initial: ClientFormValues; mode: 'create' | 'edit' }) {
  const [state, formAction] = useActionState(mode === 'create' ? createClientAction : updateClientAction, undefined)
  const v = { ...initial, ...(state?.values ?? {}) }
  const e = state?.errors ?? {}

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert state={state} />
        </div>
      )}

      {mode === 'create' && (
        <Field label="Email" htmlFor="email" error={e.email} className="sm:col-span-2">
          <input id="email" name="email" type="email" defaultValue={v.email} className="field-input" {...invalid(state, 'email')} />
        </Field>
      )}
      <Field label="Household / Client Name" htmlFor="name" error={e.name}>
        <input id="name" name="name" defaultValue={v.name} className="field-input" {...invalid(state, 'name')} />
      </Field>
      <Field label="Phone" htmlFor="phone" optional error={e.phone}>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className="field-input" />
      </Field>
      <Field label="Delivery Address" htmlFor="address" optional error={e.address} className="sm:col-span-2">
        <input id="address" name="address" defaultValue={v.address} className="field-input" />
      </Field>
      <Field label="Weekly Quota (meals)" htmlFor="weeklyQuota" error={e.weeklyQuota}>
        <input
          id="weeklyQuota"
          name="weeklyQuota"
          type="number"
          min={1}
          max={60}
          defaultValue={v.weeklyQuota}
          className="field-input"
          {...invalid(state, 'weeklyQuota')}
        />
      </Field>
      <Field label="Delivery Day" htmlFor="deliveryDay">
        <select id="deliveryDay" name="deliveryDay" defaultValue={v.deliveryDay} className="field-input">
          <option value="MONDAY">Monday</option>
          <option value="THURSDAY">Thursday</option>
        </select>
      </Field>
      <Field label="Membership Status" htmlFor="status" hint="Activating a pending client emails them automatically." className="sm:col-span-2">
        <select id="status" name="status" defaultValue={v.status} className="field-input">
          <option value="PENDING">Pending review</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
        </select>
      </Field>
      <Field label="Dietary Parameters" htmlFor="dietaryNotes" optional className="sm:col-span-2">
        <textarea id="dietaryNotes" name="dietaryNotes" rows={3} defaultValue={v.dietaryNotes} className="field-input resize-y" />
      </Field>

      {mode === 'create' && (
        <label className="flex items-center gap-3 text-[14px] text-muted sm:col-span-2">
          <input type="checkbox" name="sendInvite" defaultChecked className="h-4 w-4 accent-[#C5A059]" />
          Email the client a sign-in link now
        </label>
      )}

      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving…">{mode === 'create' ? 'Create Client Household' : 'Save Changes'}</SubmitButton>
      </div>
    </form>
  )
}
