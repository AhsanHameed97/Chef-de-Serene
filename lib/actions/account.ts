'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import { fieldErrors, newPasswordSchema, profileSchema } from '@/lib/validation'
import type { FormState } from '@/lib/actions/types'

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser()
  const keys = ['name', 'phone', 'address', 'dietaryNotes'] as const
  const values = Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? '')]))
  const parsed = profileSchema.safeParse(values)
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values }

  await prisma.user.update({
    where: { id: user.id },
    data: { ...parsed.data, dietaryNotes: parsed.data.dietaryNotes ?? null },
  })
  revalidatePath('/portal', 'layout')
  return { ok: true, message: 'Household details updated.', values }
}

export async function setPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser()
  const parsed = newPasswordSchema.safeParse({ password: formData.get('password') ?? '', confirm: formData.get('confirm') ?? '' })
  if (!parsed.success) return { errors: fieldErrors(parsed.error) }

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(parsed.data.password) } })
  return { ok: true, message: 'Your access passcode has been updated.' }
}
