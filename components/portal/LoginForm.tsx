'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { loginAction, magicLinkAction } from '@/lib/actions/auth'
import type { FormState } from '@/lib/actions/types'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'

type Mode = 'password' | 'link'

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [mode, setMode] = useState<Mode>(notice ? 'link' : 'password')
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
        <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{linkState.message}</p>
        {linkState.devLink && (
          <a
            href={linkState.devLink}
            className="mt-6 block rounded-[2px] border border-dashed border-gold/40 px-4 py-3 text-[14px] text-gold hover:bg-gold/5"
          >
            Development shortcut: open the sign-in link &rarr;
          </a>
        )}
        <button type="button" onClick={() => setDismissed(linkState)} className="mono-label mt-8 text-[12px] text-muted hover:text-gold">
          Use a different email
        </button>
      </div>
    )
  }

  const state = mode === 'password' ? loginState : linkState

  return (
    <div>
      <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-2 rounded-[2px] border border-line bg-obsidian p-1">
        {(
          [
            ['password', 'Password'],
            ['link', 'Email Link'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={mode === value}
            onClick={() => setMode(value)}
            className={`mono-label rounded-[2px] py-2.5 text-[12px] transition-colors ${
              mode === value ? 'bg-elevated text-gold' : 'text-muted hover:text-alabaster'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form action={mode === 'password' ? loginFormAction : linkFormAction} className="mt-6 flex flex-col gap-5" noValidate>
        <input type="hidden" name="next" value={next ?? ''} />
        {notice && !state && <FormAlert state={{ message: notice }} />}
        <FormAlert state={state} />

        <Field label="Email Address" htmlFor="email" error={state?.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field-input"
            {...invalid(state, 'email')}
          />
        </Field>

        {mode === 'password' ? (
          <>
            <Field label="Password" htmlFor="password" error={loginState?.errors?.password}>
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
            <SubmitButton className="mt-1 w-full" pendingLabel="Signing in…">
              Sign In &rarr;
            </SubmitButton>
            <button type="button" onClick={() => setMode('link')} className="-mt-1 text-center text-[14px] text-muted hover:text-gold">
              Forgot your password? Email me a sign-in link
            </button>
          </>
        ) : (
          <>
            <p className="-mt-1 text-[14px] leading-relaxed text-muted">
              We’ll email you a one-time link that signs you in instantly—no password needed.
            </p>
            <SubmitButton className="w-full" pendingLabel="Sending link…">
              Email Me a Sign-In Link &rarr;
            </SubmitButton>
          </>
        )}
      </form>

      <div className="mt-8 border-t border-line pt-6 text-center text-[14.5px] text-muted">
        Don’t have an account?{' '}
        <Link href="/portal/signup" className="text-gold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
