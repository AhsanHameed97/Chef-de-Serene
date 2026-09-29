import * as z from 'zod'

// Shared runtime validation (server actions, API routes, and client forms).

const trimmed = (min: number, max: number, message: string) => z.string(message).trim().min(min, message).max(max)
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

export const emailField = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'))
export const passwordField = z.string().min(8, 'Use at least 8 characters').max(200)

/* ---------------- Portal auth ---------------- */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your passcode'),
})

export const magicLinkSchema = z.object({ email: emailField })

export const signupSchema = z.object({
  name: trimmed(2, 120, 'Enter your full name'),
  email: emailField,
  phone: trimmed(7, 30, 'Enter a direct phone number'),
  address: trimmed(5, 300, 'Enter the delivery address'),
  deliveryDay: z.enum(['MONDAY', 'THURSDAY'], 'Choose a delivery day'),
  plan: z.enum(['10', '14'], 'Choose a weekly allocation'),
  dietaryNotes: optionalText(1000),
  password: passwordField,
})

export const profileSchema = z.object({
  name: trimmed(2, 120, 'Enter your full name'),
  phone: trimmed(7, 30, 'Enter a direct phone number'),
  address: trimmed(5, 300, 'Enter the delivery address'),
  dietaryNotes: optionalText(1000),
})

export const newPasswordSchema = z
  .object({ password: passwordField, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'Passcodes do not match', path: ['confirm'] })

/* ---------------- Weekly order ---------------- */

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.uuid(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1, 'Select at least one meal')
    .max(60),
  notes: optionalText(1000),
})

/* ---------------- Confidential inquiry (POST /api/inquiry) ---------------- */

const contactFields = {
  client_name: trimmed(2, 120, 'Enter your full name'),
  role: z.enum(['Estate Manager', 'Chief of Staff', 'Principal', 'Family Office', 'Other'], 'Select your role'),
  email: emailField,
  phone: trimmed(7, 30, 'Enter a direct phone number'),
  location: trimmed(2, 200, 'Enter the residence location'),
}

export const mealPrepDetailsSchema = z
  .object({
    meal_volume: z.enum(['10_MEALS', '14_MEALS', 'CUSTOM'], 'Select a weekly volume'),
    custom_meal_count: z.number().int().min(1).max(60).optional(),
    delivery_days: z.array(z.enum(['MONDAY', 'THURSDAY'])).min(1, 'Select at least one delivery day'),
    dietary_notes: optionalText(2000),
  })
  .refine((v) => v.meal_volume !== 'CUSTOM' || v.custom_meal_count, {
    message: 'Enter the number of meals per week',
    path: ['custom_meal_count'],
  })

export const privateDiningDetailsSchema = z.object({
  engagement_type: z.enum(['FULL_ESTATE_RETAINER', 'BESPOKE_TASTING_EVENT'], 'Select an engagement type'),
  party_size: z.number('Enter the party size').int().min(1, 'Enter the party size').max(500),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select a target date'),
  menu_style: z.enum(['TASTING_MENU', 'FAMILY_STYLE'], 'Select a menu style'),
  course_count: z.number().int().min(1).max(15),
  protein_preferences: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
  nda_required: z.boolean().default(false),
})

export const inquirySchema = z.discriminatedUnion('inquiry_type', [
  z.object({ inquiry_type: z.literal('MEAL_PREP'), ...contactFields, meal_prep_details: mealPrepDetailsSchema }),
  z.object({
    inquiry_type: z.literal('PRIVATE_DINING'),
    ...contactFields,
    private_dining_details: privateDiningDetailsSchema,
  }),
])

export type InquiryPayload = z.infer<typeof inquirySchema>

/* ---------------- Admin ---------------- */

const optionalInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().min(0).max(5000).optional(),
)

export const menuItemSchema = z.object({
  title: trimmed(2, 120, 'Enter a dish title'),
  description: trimmed(2, 400, 'Enter a short description'),
  // Either a site-relative path to a photo in /public (e.g. /assets/menu/salmon.jpg) or a full https URL
  imageUrl: z
    .string()
    .trim()
    .refine((v) => /^\/[\w\-./%]+$/.test(v) || /^https:\/\/\S+$/.test(v), 'Use /assets/menu/photo.jpg or a full https:// URL'),
  category: trimmed(2, 60, 'Enter a category'),
  specs: z
    .string()
    .default('')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  calories: optionalInt,
  proteinG: optionalInt,
  carbsG: optionalInt,
  fatG: optionalInt,
  sortOrder: z.preprocess((v) => (v === '' || v == null ? 0 : Number(v)), z.number().int().min(0).max(9999)),
  active: z.preprocess((v) => v === 'on' || v === 'true' || v === true, z.boolean()),
})

export const adminClientSchema = z.object({
  name: trimmed(2, 120, 'Enter the client name'),
  phone: optionalText(30),
  address: optionalText(300),
  deliveryDay: z.enum(['MONDAY', 'THURSDAY']),
  weeklyQuota: z.preprocess((v) => Number(v), z.number().int().min(1, 'Minimum 1 meal').max(60)),
  status: z.enum(['PENDING', 'ACTIVE', 'PAUSED']),
  dietaryNotes: optionalText(1000),
})

export const adminNewClientSchema = adminClientSchema.extend({ email: emailField })

/** Flatten zod issues into { field: firstMessage } for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_form'
    if (!out[key]) out[key] = issue.message
  }
  return out
}
