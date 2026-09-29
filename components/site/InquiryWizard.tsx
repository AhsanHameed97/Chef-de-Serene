'use client'

import { useState } from 'react'
import { useForm, type FieldPath, type Resolver, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { inquirySchema } from '@/lib/validation'

export type Fork = 'MEAL_PREP' | 'PRIVATE_DINING'

type Values = {
  inquiry_type: Fork | ''
  client_name: string
  role: string
  email: string
  phone: string
  location: string
  company_website: string
  meal_prep_details: {
    meal_volume: string
    custom_meal_count?: number
    delivery_days: string[]
    dietary_notes: string
  }
  private_dining_details: {
    engagement_type: string
    party_size?: number
    event_date: string
    menu_style: string
    course_count: number
    protein_preferences: string[]
    nda_required: boolean
  }
}

const DIETARY_CHIPS = ['Gluten-Free', 'Dairy-Free', 'Low-Glycemic', 'Anti-Inflammatory', 'Nut Allergy', 'Pescatarian']
const PROTEINS = ['Wagyu', 'Grass-Fed Bison', 'Wild King Salmon', 'Langoustine', 'Heritage Poultry', 'Plant-Forward']
const STEP_TITLES = ['Choose Your Service', 'Your Preferences', 'Your Contact Details']

type Props = { initialFork?: Fork; variant?: 'inline' | 'modal'; onClose?: () => void }

export function InquiryWizard({ initialFork, variant = 'inline', onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialFork ? 2 : 1)
  const [dietChips, setDietChips] = useState<string[]>([])
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(inquirySchema, undefined, { raw: true }) as unknown as Resolver<Values>,
    mode: 'onTouched',
    defaultValues: {
      inquiry_type: initialFork ?? '',
      client_name: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      company_website: '',
      meal_prep_details: { meal_volume: '14_MEALS', delivery_days: ['MONDAY'], dietary_notes: '' },
      private_dining_details: {
        engagement_type: 'BESPOKE_TASTING_EVENT',
        event_date: '',
        menu_style: 'TASTING_MENU',
        course_count: 5,
        protein_preferences: [],
        nda_required: false,
      },
    },
  })

  const fork = watch('inquiry_type')
  const volume = watch('meal_prep_details.meal_volume')
  const today = new Date().toISOString().slice(0, 10)

  function chooseFork(next: Fork) {
    setValue('inquiry_type', next)
    setServerError(null)
    setStep(2)
  }

  async function continueToContact() {
    const ok = await trigger(fork === 'MEAL_PREP' ? 'meal_prep_details' : 'private_dining_details')
    if (ok) setStep(3)
  }

  async function onSubmit(values: Values) {
    setServerError(null)
    const contact = {
      inquiry_type: values.inquiry_type,
      client_name: values.client_name,
      role: values.role,
      email: values.email,
      phone: values.phone,
      location: values.location,
      company_website: values.company_website,
    }
    const m = values.meal_prep_details
    const notes = [dietChips.join(', '), m.dietary_notes.trim()].filter(Boolean).join('. ')
    const payload =
      values.inquiry_type === 'MEAL_PREP'
        ? {
            ...contact,
            meal_prep_details: {
              meal_volume: m.meal_volume,
              custom_meal_count: m.meal_volume === 'CUSTOM' ? m.custom_meal_count : undefined,
              delivery_days: m.delivery_days,
              dietary_notes: notes || undefined,
            },
          }
        : { ...contact, private_dining_details: values.private_dining_details }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> }
      if (!res.ok) {
        const fields = Object.entries(data.fields ?? {})
        fields.forEach(([path, message]) => setError(path as FieldPath<Values>, { message }))
        if (fields.some(([path]) => path.includes('_details'))) setStep(2)
        setServerError(data.error ?? 'We could not send your booking request. Please try again.')
        return
      }
      setStep(4)
    } catch {
      setServerError('Connection lost. Please check your network and try again.')
    }
  }

  const md = errors.meal_prep_details
  const pd = errors.private_dining_details

  return (
    <div
      className={
        variant === 'inline'
          ? 'lux-card rounded-[4px] !bg-[linear-gradient(180deg,rgba(24,24,24,0.94),rgba(14,14,14,0.94))] p-6 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85),0_0_80px_-30px_rgba(197,160,89,0.3)] backdrop-blur-md sm:p-11'
          : ''
      }
    >
      {step < 4 && (
        <div className="mb-8">
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`h-[2px] flex-1 transition-colors duration-500 ${n <= step ? 'bg-gold' : 'bg-line'}`} />
            ))}
          </div>
          <p className="mono-label mt-4 text-[12px] text-muted">
            Step {step} of 3 · <span className="text-gold">{STEP_TITLES[step - 1]}</span>
            {step > 1 && fork && (
              <span className="text-muted"> · {fork === 'MEAL_PREP' ? 'Weekly Meal Prep' : 'Private Dining'}</span>
            )}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Honeypot for bots */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register('company_website')} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step === 2 ? `2-${fork}` : step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <PillarCard
                  option="Meal Plan"
                  title="Weekly Meal Prep"
                  body="Dietitian-aligned, Michelin-crafted meals sealed in luxury glassware—10 to 14 per week."
                  onSelect={() => chooseFork('MEAL_PREP')}
                  selected={fork === 'MEAL_PREP'}
                />
                <PillarCard
                  option="Private Chef"
                  title="Private Dining"
                  body="Dinner parties, tasting menus, events and full-time private chef service at your residence."
                  onSelect={() => chooseFork('PRIVATE_DINING')}
                  selected={fork === 'PRIVATE_DINING'}
                />
              </div>
            )}

            {step === 2 && fork === 'MEAL_PREP' && (
              <div className="grid gap-7">
                <Group label="Meals per Week" error={md?.meal_volume?.message}>
                  <div className="grid grid-cols-3 gap-2.5">
                    <Choice type="radio" reg={register('meal_prep_details.meal_volume')} value="10_MEALS" label="10 Meals / wk" />
                    <Choice type="radio" reg={register('meal_prep_details.meal_volume')} value="14_MEALS" label="14 Meals / wk" />
                    <Choice type="radio" reg={register('meal_prep_details.meal_volume')} value="CUSTOM" label="Custom" />
                  </div>
                  {volume === 'CUSTOM' && (
                    <input
                      type="number"
                      min={1}
                      max={60}
                      placeholder="Meals per week"
                      className="field-input mt-3 max-w-[220px]"
                      aria-invalid={Boolean(md?.custom_meal_count)}
                      {...register('meal_prep_details.custom_meal_count', {
                        setValueAs: (v) => (v === '' || v == null ? undefined : Number(v)),
                      })}
                    />
                  )}
                  {md?.custom_meal_count?.message && <ErrorText>{md.custom_meal_count.message}</ErrorText>}
                </Group>

                <Group label="Delivery Days" hint="Choose one or both. Up to two deliveries per week." error={md?.delivery_days?.message}>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Choice type="checkbox" reg={register('meal_prep_details.delivery_days')} value="MONDAY" label="Monday Delivery" />
                    <Choice type="checkbox" reg={register('meal_prep_details.delivery_days')} value="THURSDAY" label="Thursday Delivery" />
                  </div>
                </Group>

                <Group label="Dietary Needs" hint="Select any that apply, then add allergies or any guidelines from your dietitian.">
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_CHIPS.map((chip) => {
                      const on = dietChips.includes(chip)
                      return (
                        <button
                          key={chip}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setDietChips((c) => (on ? c.filter((x) => x !== chip) : [...c, chip]))}
                          className="filter-pill !py-2 !text-[12px]"
                        >
                          {chip}
                        </button>
                      )
                    })}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Allergies, physician or RD guidelines, metabolic goals…"
                    className="field-input mt-3 resize-y"
                    {...register('meal_prep_details.dietary_notes')}
                  />
                </Group>
              </div>
            )}

            {step === 2 && fork === 'PRIVATE_DINING' && (
              <div className="grid gap-7">
                <Group label="Type of Service" error={pd?.engagement_type?.message}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Choice
                      type="radio"
                      reg={register('private_dining_details.engagement_type')}
                      value="FULL_ESTATE_RETAINER"
                      label="Full-Time Private Chef"
                    />
                    <Choice
                      type="radio"
                      reg={register('private_dining_details.engagement_type')}
                      value="BESPOKE_TASTING_EVENT"
                      label="Dinner Party / Event"
                    />
                  </div>
                </Group>

                <Group label="Event Details">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <input
                        type="number"
                        min={1}
                        placeholder="Party size"
                        aria-label="Party size"
                        className="field-input"
                        aria-invalid={Boolean(pd?.party_size)}
                        {...register('private_dining_details.party_size', { valueAsNumber: true })}
                      />
                      {pd?.party_size?.message && <ErrorText>{pd.party_size.message}</ErrorText>}
                    </div>
                    <div>
                      <input
                        type="date"
                        min={today}
                        aria-label="Target date"
                        className="field-input"
                        aria-invalid={Boolean(pd?.event_date)}
                        {...register('private_dining_details.event_date')}
                      />
                      {pd?.event_date?.message && <ErrorText>{pd.event_date.message}</ErrorText>}
                    </div>
                    <select
                      aria-label="Number of courses"
                      className="field-input"
                      {...register('private_dining_details.course_count', { valueAsNumber: true })}
                    >
                      {[3, 5, 7, 9, 12].map((n) => (
                        <option key={n} value={n}>
                          {n} courses
                        </option>
                      ))}
                    </select>
                  </div>
                </Group>

                <Group label="Menu Style">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Choice type="radio" reg={register('private_dining_details.menu_style')} value="TASTING_MENU" label="Tasting Menu" />
                    <Choice type="radio" reg={register('private_dining_details.menu_style')} value="FAMILY_STYLE" label="Family-Style" />
                  </div>
                </Group>

                <Group label="Preferred Proteins" hint="Optional — we finalise every menu with you directly.">
                  <div className="flex flex-wrap gap-2">
                    {PROTEINS.map((p) => (
                      <Choice key={p} type="checkbox" reg={register('private_dining_details.protein_preferences')} value={p} label={p} compact />
                    ))}
                  </div>
                </Group>

                <label className="flex cursor-pointer items-start gap-3 rounded-[2px] border border-line bg-obsidian/60 p-4 has-[:checked]:border-gold/60">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[#C5A059]" {...register('private_dining_details.nda_required')} />
                  <span>
                    <span className="block text-[15.5px] text-alabaster">NDA required before the first call</span>
                    <span className="mt-0.5 block text-[14px] text-muted">We sign your NDA (or ours) before any household details are shared.</span>
                  </span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Full Name" error={errors.client_name?.message}>
                  <input className="field-input" autoComplete="name" aria-invalid={Boolean(errors.client_name)} {...register('client_name')} />
                </TextField>
                <TextField label="Role" error={errors.role?.message}>
                  <select className="field-input" aria-invalid={Boolean(errors.role)} {...register('role')}>
                    <option value="" disabled>
                      Select role
                    </option>
                    <option>Estate Manager</option>
                    <option>Chief of Staff</option>
                    <option>Principal</option>
                    <option>Family Office</option>
                    <option>Other</option>
                  </select>
                </TextField>
                <TextField label="Phone Number" error={errors.phone?.message}>
                  <input className="field-input" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register('phone')} />
                </TextField>
                <TextField label="Email Address" error={errors.email?.message}>
                  <input className="field-input" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
                </TextField>
                <TextField label={fork === 'MEAL_PREP' ? 'Delivery Area / ZIP Code' : 'Event Location'} error={errors.location?.message} full>
                  <input
                    className="field-input"
                    placeholder={fork === 'MEAL_PREP' ? 'e.g. Bel Air, 90077' : 'e.g. Beverly Hills, CA'}
                    aria-invalid={Boolean(errors.location)}
                    {...register('location')}
                  />
                </TextField>
              </div>
            )}

            {step === 4 && (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-xl text-gold">✓</div>
                <h3 className="mt-6 font-serif text-[28px] tracking-[-0.02em] text-alabaster">Booking Request Received</h3>
                <p className="mx-auto mt-3 max-w-md text-[16.5px] leading-relaxed text-muted">
                  Thank you. Our team will contact you within one business day to confirm the details.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                  {variant === 'modal' ? (
                    <button type="button" className="btn-outline" onClick={onClose}>
                      Close
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {
                        reset()
                        setDietChips([])
                        setStep(1)
                      }}
                    >
                      Make Another Booking
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {serverError && step < 4 && (
          <p role="alert" className="mt-6 rounded-[2px] border border-danger/40 bg-danger/[0.07] px-4 py-3 text-[15px] text-danger">
            {serverError}
          </p>
        )}

        {step > 1 && step < 4 && (
          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="mono-label text-[12px] text-muted transition-colors hover:text-alabaster"
              onClick={() => setStep(step === 3 ? 2 : 1)}
            >
              ← {step === 2 ? 'Change service' : 'Back'}
            </button>
            {step === 2 ? (
              <button type="button" className="btn-gold" onClick={continueToContact}>
                Continue →
              </button>
            ) : (
              <button type="submit" className="btn-gold" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send Booking Request →'}
              </button>
            )}
          </div>
        )}
      </form>

    </div>
  )
}

function PillarCard({
  option,
  title,
  body,
  selected,
  onSelect,
}: {
  option: string
  title: string
  body: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex flex-col rounded-[4px] border bg-obsidian/60 p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_0_40px_-15px_rgba(197,160,89,0.35)] sm:p-8 ${
        selected ? 'border-gold' : 'border-line'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? 'border-gold' : 'border-muted/60'}`}>
          {selected && <span className="h-2 w-2 rounded-full bg-gold" />}
        </span>
        <span className="mono-label text-[12px] text-gold">{option}</span>
      </span>
      <span className="mt-4 font-serif text-[26px] leading-tight tracking-[-0.02em] text-alabaster">{title}</span>
      <span className="mt-2 text-[15.5px] leading-relaxed text-muted">{body}</span>
      <span className="mono-label mt-6 text-[12px] text-alabaster/60 transition-colors group-hover:text-gold">Select &rarr;</span>
    </button>
  )
}

function Choice({
  type,
  reg,
  value,
  label,
  compact,
}: {
  type: 'radio' | 'checkbox'
  reg: UseFormRegisterReturn
  value: string
  label: string
  compact?: boolean
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-center rounded-[2px] border border-line bg-obsidian/60 text-center text-muted transition-colors hover:border-[#3a3a3a] hover:text-alabaster has-[:checked]:border-gold has-[:checked]:bg-gold/[0.07] has-[:checked]:text-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-gold ${
        compact ? 'px-3.5 py-2 text-[14px]' : 'px-3 py-3 text-[15px]'
      }`}
    >
      <input type={type} value={value} className="sr-only" {...reg} />
      {label}
    </label>
  )
}

function Group({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mono-label mb-3 text-[12px] text-muted">{label}</legend>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : hint ? <p className="mt-2 text-[13.5px] text-muted/80">{hint}</p> : null}
    </fieldset>
  )
}

function TextField({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mono-label text-[12px] text-muted">{label}</span>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[14px] text-danger">{children}</p>
}
