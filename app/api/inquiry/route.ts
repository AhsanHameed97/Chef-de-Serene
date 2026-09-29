import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fieldErrors, inquirySchema } from '@/lib/validation'
import { INQUIRY_TYPE_LABEL, inquiryRows } from '@/lib/inquiry'
import { notifyRecipients, sendEmailSafely } from '@/lib/email'
import { inquiryAlertEmail, inquiryReceiptEmail } from '@/lib/email-templates'
import { sendSmsAlert } from '@/lib/sms'
import { appUrl } from '@/lib/url'

// POST /api/inquiry — booking requests from the 2-fork booking form (Master Spec §3.1).
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const parsed = inquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please review the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }

  const data = parsed.data
  const inquiry = await prisma.inquiry.create({
    data: {
      type: data.inquiry_type,
      name: data.client_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      location: data.location,
      payloadJson: data,
    },
  })

  const typeLabel = INQUIRY_TYPE_LABEL[data.inquiry_type]
  await Promise.all([
    sendEmailSafely({
      to: notifyRecipients(),
      replyTo: data.email,
      ...inquiryAlertEmail({ typeLabel, name: data.client_name, rows: inquiryRows(data), adminUrl: `${appUrl()}/portal/admin/inquiries` }),
    }),
    sendEmailSafely({ to: data.email, ...inquiryReceiptEmail({ name: data.client_name, typeLabel }) }),
    sendSmsAlert(`Chef de Serene — new ${typeLabel} booking request from ${data.client_name} (${data.role}), ${data.phone}. ${appUrl()}/portal/admin/inquiries`),
  ])

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 })
}
