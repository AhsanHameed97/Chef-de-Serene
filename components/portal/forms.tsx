'use client'

import { useFormStatus } from 'react-dom'
import type { FormState } from '@/lib/actions/types'

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, error, hint, optional, className = '', children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="mono-label text-[12px] text-muted">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal opacity-60">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-[14px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13.5px] text-muted/80">{hint}</p>
      ) : null}
    </div>
  )
}

type SubmitProps = {
  children: React.ReactNode
  pendingLabel?: string
  variant?: 'gold' | 'outline' | 'ghost-gold'
  className?: string
  formAction?: (formData: FormData) => void
  formNoValidate?: boolean
  disabled?: boolean
}

export function SubmitButton({
  children,
  pendingLabel = 'Please wait…',
  variant = 'gold',
  className = '',
  formAction,
  formNoValidate,
  disabled,
}: SubmitProps) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      formAction={formAction}
      formNoValidate={formNoValidate}
      disabled={pending || disabled}
      className={`btn-${variant} ${className}`}
      aria-busy={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormAlert({ state }: { state: FormState }) {
  if (!state?.message) return null
  return (
    <div
      role={state.ok ? 'status' : 'alert'}
      className={`rounded-[2px] border px-4 py-3 text-[15px] ${
        state.ok ? 'border-gold/30 bg-gold/[0.06] text-alabaster' : 'border-danger/40 bg-danger/[0.07] text-danger'
      }`}
    >
      {state.message}
    </div>
  )
}

/** aria helpers for inputs */
export function invalid(state: FormState, name: string) {
  const error = state?.errors?.[name]
  return error ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` } : {}
}
