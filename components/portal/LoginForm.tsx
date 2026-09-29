'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { loginAction, magicLinkAction } from '@/lib/actions/auth'
import type { FormState } from '@/lib/actions/types'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'

type Mode = 'passcode' | 'link'

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [mode, setMode] = useState<Mode>(notice ? 'link' : 'passcode')
  const [email, setEmail] = useState('')
  const [loginState, loginFormAction] = useActionState(loginAction, undefined)
  const [linkState, linkFormAction] = useActionState(magicLinkAction, undefined)
  const [dismissed, setDismissed] = useState<FormState>(undefined)

  if (linkState?.ok && linkState !== dismissed) {
    return (
      <div className="animate-fade-up text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="3" y="5" width="18" height="14" rx="1.5" />
            <path d="M3.5 6.5 12 13l8.5-6.5" />
          </svg>
        </div>
        <h2 className="mt-5 font-serif text-[22px] tracking-[-0.01em]">Check Your Inbox</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">{linkState.message}</p>
        {linkState.devLink && (
          <a
            href={linkState.devLink}
            className="mt-6 block rounded-[2px] border border-dashed border-gold/40 px-4 py-3 text-[12.5px] text-gold hover:bg-gold/5"
          >
            Development shortcut: open the sign-in link &rarr;
          </a>
        )}
        <button type="button" onClick={() => setDismissed(linkState)} className="mono-label mt-8 text-[10px] text-muted hover:text-gold">
          Use a different email
        </button>
      </div>
    )
  }

  const state = mode === 'passcode' ? loginState : linkState

  return (
    <div>
      <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-2 rounded-[2px] border border-line bg-obsidian p-1">
        {(
          [
            ['passcode', 'Access Passcode'],
            ['link', 'Magic Link'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={mode === value}
            onClick={() => setMode(value)}
            className={`mono-label rounded-[2px] py-2.5 text-[10px] transition-colors ${
              mode === value ? 'bg-elevated text-gold' : 'text-muted hover:text-alabaster'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form action={mode === 'passcode' ? loginFormAction : linkFormAction} className="mt-6 flex flex-col gap-5" noValidate>
        <input type="hidden" name="next" value={next ?? ''} />
        {notice && !state && <FormAlert state={{ message: notice }} />}
        <FormAlert state={state} />

        <Field label="Confidential Email" htmlFor="email" error={state?.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@familyoffice.com"
            className="field-input"
            {...invalid(state, 'email')}
          />
        </Field>

        {mode === 'passcode' ? (
          <>
            <Field label="Access Passcode" htmlFor="password" error={loginState?.errors?.password}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="field-input"
                {...invalid(loginState, 'password')}
              />
            </Field>
            <SubmitButton className="mt-1 w-full" pendingLabel="Verifying…">
              Enter Private Dashboard &rarr;
            </SubmitButton>
            <button type="button" onClick={() => setMode('link')} className="-mt-1 text-center text-[12.5px] text-muted hover:text-gold">
              Forgot your passcode? Email me a sign-in link
            </button>
          </>
        ) : (
          <>
            <p className="-mt-1 text-[12.5px] leading-relaxed text-muted">
              We’ll email a single-use link that signs you in instantly—no passcode required.
            </p>
            <SubmitButton className="w-full" pendingLabel="Sending secure link…">
              Email Me a Magic Link &rarr;
            </SubmitButton>
          </>
        )}
      </form>

      <div className="mt-8 border-t border-line pt-6 text-center text-[13px] text-muted">
        New household?{' '}
        <Link href="/portal/signup" className="text-gold hover:underline">
          Request portal access
        </Link>
      </div>
    </div>
  )
}
