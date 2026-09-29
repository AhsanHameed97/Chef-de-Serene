import type { InquiryPayload } from '@/lib/validation'

export const INQUIRY_TYPE_LABEL: Record<string, string> = {
  MEAL_PREP: 'Weekly Meal Prep',
  PRIVATE_DINING: 'Private Estate Dining',
}

const VOLUME: Record<string, string> = { '10_MEALS': '10 meals / week', '14_MEALS': '14 meals / week', CUSTOM: 'Custom allocation' }
const ENGAGEMENT: Record<string, string> = {
  FULL_ESTATE_RETAINER: 'Full Estate Retainer',
  BESPOKE_TASTING_EVENT: 'Bespoke Tasting Event',
}
const MENU_STYLE: Record<string, string> = { TASTING_MENU: 'Tasting menu', FAMILY_STYLE: 'Family-style' }
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()

export function formatEventDate(iso: string) {
  const d = new Date(`${iso}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/** Human-readable rows for emails and the admin inbox. */
export function inquiryRows(p: InquiryPayload): [string, string][] {
  const rows: [string, string][] = [
    ['Name', p.client_name],
    ['Role', p.role],
    ['Email', p.email],
    ['Phone', p.phone],
    ['Location', p.location],
  ]
  if (p.inquiry_type === 'MEAL_PREP') {
    const m = p.meal_prep_details
    rows.push(
      ['Weekly volume', m.meal_volume === 'CUSTOM' ? `Custom · ${m.custom_meal_count} meals / week` : VOLUME[m.meal_volume]],
      ['Delivery days', m.delivery_days.map(title).join(' & ')],
    )
    if (m.dietary_notes) rows.push(['Dietary parameters', m.dietary_notes])
  } else {
    const d = p.private_dining_details
    rows.push(
      ['Engagement', ENGAGEMENT[d.engagement_type]],
      ['Party size', `${d.party_size} guests`],
      ['Target date', formatEventDate(d.event_date)],
      ['Menu architecture', `${MENU_STYLE[d.menu_style]} · ${d.course_count} courses`],
    )
    if (d.protein_preferences.length) rows.push(['Anchor proteins', d.protein_preferences.join(', ')])
    rows.push(['Discretion', d.nda_required ? 'Custom NDA required prior to initial call' : 'Standard confidentiality'])
  }
  return rows
}
