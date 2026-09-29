'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { signupAction } from '@/lib/actions/auth'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'

const PLANS = [
  { value: '10', title: '10 Meals / Week', note: 'Weekday lunch & dinner' },
  { value: '14', title: '14 Meals / Week', note: 'Full week, lunch & dinner' },
]

const DAYS = [
  { value: 'MONDAY', title: 'Monday', note: 'Start of the week' },
  { value: 'THURSDAY', title: 'Thursday', note: 'Ahead of the weekend' },
]

function OptionTiles({
  name,
  options,
  defaultValue,
  error,
}: {
  name: string
  options: { value: string; title: string; note: string }[]
  defaultValue?: string
  error?: string
}) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-invalid={Boolean(error)}>
      {options.map((o) => (
        <label
          key={o.value}
          className="relative cursor-pointer rounded-[2px] border border-line bg-obsidian px-4 py-3.5 transition-colors hover:border-[#3a3a3a] has-[:checked]:border-gold has-[:checked]:bg-gold/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-gold"
        >
          <input type="radio" name={name} value={o.value} defaultChecked={defaultValue === o.value} className="peer sr-only" required />
          <span className="block text-[15.5px] text-alabaster peer-checked:text-gold">{o.title}</span>
          <span className="mt-0.5 block text-[13.5px] text-muted">{o.note}</span>
        </label>
      ))}
    </div>
  )
}

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, undefined)
  const [showPass, setShowPass] = useState(false)
  const v = state?.values ?? {}
  const e = state?.errors ?? {}

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert state={state} />
        </div>
      )}

      <Field label="Full Name" htmlFor="name" error={e.name}>
        <input id="name" name="name" autoComplete="name" defaultValue={v.name} required className="field-input" {...invalid(state, 'name')} />
      </Field>
      <Field label="Phone Number" htmlFor="phone" error={e.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={v.phone}
          placeholder="+1 (310) 555-0199"
          required
          className="field-input"
          {...invalid(state, 'phone')}
        />
      </Field>
      <Field label="Email Address" htmlFor="email" error={e.email} className="sm:col-span-2">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={v.email}
          required
          className="field-input"
          {...invalid(state, 'email')}
        />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password} hint="At least 8 characters.">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            className="field-input pr-16"
            {...invalid(state, 'password')}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="mono-label absolute inset-y-0 right-3 text-[11px] text-muted hover:text-gold"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
      </Field>

      <Field label="Confirm Password" htmlFor="confirm" error={e.confirm}>
        <input
          id="confirm"
          name="confirm"
          type={showPass ? 'text' : 'password'}
          autoComplete="new-password"
          required
          className="field-input"
          {...invalid(state, 'confirm')}
        />
      </Field>

      <Field label="Delivery Address" htmlFor="address" error={e.address} className="sm:col-span-2">
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          defaultValue={v.address}
          placeholder="Street, city, ZIP code"
          required
          className="field-input"
          {...invalid(state, 'address')}
        />
      </Field>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <span className="mono-label text-[12px] text-muted">Meals per Week</span>
        <OptionTiles name="plan" options={PLANS} defaultValue={v.plan ?? '14'} error={e.plan} />
        {e.plan && <p className="text-[14px] text-danger">{e.plan}</p>}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <span className="mono-label text-[12px] text-muted">Delivery Day</span>
        <OptionTiles name="deliveryDay" options={DAYS} defaultValue={v.deliveryDay ?? 'MONDAY'} error={e.deliveryDay} />
        {e.deliveryDay && <p className="text-[14px] text-danger">{e.deliveryDay}</p>}
      </div>

      <Field label="Dietary Needs" htmlFor="dietaryNotes" optional error={e.dietaryNotes} className="sm:col-span-2">
        <textarea
          id="dietaryNotes"
          name="dietaryNotes"
          rows={3}
          defaultValue={v.dietaryNotes}
          placeholder="Allergies, foods to avoid, or guidelines from your dietitian"
          className="field-input resize-y"
        />
      </Field>

      <div className="sm:col-span-2">
        <SubmitButton className="w-full" pendingLabel="Creating account…">
          Create Account &rarr;
        </SubmitButton>
      </div>

      <div className="border-t border-line pt-6 text-center text-[14.5px] text-muted sm:col-span-2">
        Already have an account?{' '}
        <Link href="/portal/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
