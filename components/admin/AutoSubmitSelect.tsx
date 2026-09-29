'use client'

import { useFormStatus } from 'react-dom'

type Props = {
  name: string
  defaultValue: string
  options: { value: string; label: string }[]
  label: string
  className?: string
}

/** A <select> that submits its parent form (a server action) as soon as it changes. */
export function AutoSubmitSelect({ name, defaultValue, options, label, className = '' }: Props) {
  const { pending } = useFormStatus()
  return (
    <select
      name={name}
      aria-label={label}
      defaultValue={defaultValue}
      disabled={pending}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={`mono-label cursor-pointer rounded-[2px] border border-line bg-obsidian py-2 pl-3 pr-8 text-[10px] text-alabaster transition-colors hover:border-gold focus:border-gold focus:outline-none disabled:opacity-50 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function ConfirmSubmit({ children, message, className = '' }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
