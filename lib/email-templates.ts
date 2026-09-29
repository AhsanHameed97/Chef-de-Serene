// Branded transactional email templates (inline styles for email-client support).

type Rendered = { subject: string; html: string; text: string }
type Row = [label: string, value: string | number | null | undefined]

const C = {
  bg: '#0A0A0A',
  surface: '#141414',
  border: '#262626',
  text: '#F7F5F0',
  muted: '#A1A1AA',
  gold: '#C5A059',
}

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function layout(eyebrow: string, heading: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:4px;">
    <tr><td style="padding:36px 40px 0;text-align:center;">
      <div style="display:inline-block;width:40px;height:40px;line-height:40px;border:1px solid ${C.gold};border-radius:50%;color:${C.gold};font-family:Georgia,serif;font-size:14px;">CdS</div>
      <div style="margin-top:12px;font-family:Georgia,serif;font-size:13px;letter-spacing:0.3em;color:${C.text};">CHEF DE SERENE</div>
    </td></tr>
    <tr><td style="padding:32px 40px 8px;">
      <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${C.gold};">${esc(eyebrow)}</div>
      <h1 style="margin:12px 0 0;font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.25;color:${C.text};">${esc(heading)}</h1>
    </td></tr>
    <tr><td style="padding:8px 40px 36px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.6;color:${C.muted};">
      ${body}
    </td></tr>
    <tr><td style="padding:20px 40px;border-top:1px solid ${C.border};font-family:'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#5c5c63;text-align:center;">
      Confidential &middot; Functional Fine Dining for Private Estates
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`
}

function paragraph(text: string) {
  return `<p style="margin:16px 0 0;">${esc(text)}</p>`
}

function button(label: string, href: string) {
  return `<p style="margin:28px 0 8px;"><a href="${esc(href)}" style="display:inline-block;background:${C.gold};color:${C.bg};text-decoration:none;font-weight:600;font-size:14px;padding:14px 28px;border-radius:2px;">${esc(label)} &rarr;</a></p>`
}

function detailsTable(rows: Row[]) {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid ${C.border};">
${visible
  .map(
    ([label, value]) => `<tr>
  <td style="padding:12px 12px 12px 0;border-bottom:1px solid ${C.border};font-family:'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};vertical-align:top;width:38%;">${esc(label)}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};color:${C.text};font-size:14px;vertical-align:top;white-space:pre-wrap;">${esc(value)}</td>
</tr>`,
  )
  .join('')}
</table>`
}

function rowsText(rows: Row[]) {
  return rows
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(([l, v]) => `${l}: ${v}`)
    .join('\n')
}

type LineItem = { title: string; quantity: number }

function itemsTable(items: LineItem[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid ${C.border};">
${items
  .map(
    (i) => `<tr>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};color:${C.text};font-size:14px;">${esc(i.title)}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};color:${C.gold};font-family:'SF Mono',Menlo,monospace;font-size:13px;text-align:right;width:60px;">&times; ${i.quantity}</td>
</tr>`,
  )
  .join('')}
</table>`
}

function itemsText(items: LineItem[]) {
  return items.map((i) => `  • ${i.title} × ${i.quantity}`).join('\n')
}

/* ---------------- Auth ---------------- */

export function magicLinkEmail(p: { name: string; url: string }): Rendered {
  return {
    subject: 'Your Chef de Serene sign-in link',
    html: layout(
      'Client Access Portal',
      `Welcome back, ${p.name.split(' ')[0]}.`,
      paragraph('Use the secure link below to enter your private dashboard. It expires in 20 minutes and can be used once.') +
        button('Enter Private Dashboard', p.url) +
        paragraph('If you did not request this link, you can safely ignore this email.'),
    ),
    text: `Welcome back, ${p.name}.\n\nSign in to your Chef de Serene dashboard (expires in 20 minutes, single use):\n${p.url}\n\nIf you did not request this link, ignore this email.`,
  }
}

/* ---------------- Membership ---------------- */

type Member = {
  name: string
  email: string
  phone?: string | null
  address?: string | null
  deliveryDay: string
  weeklyQuota: number
  dietaryNotes?: string | null
}

function memberRows(m: Member): Row[] {
  return [
    ['Name', m.name],
    ['Email', m.email],
    ['Phone', m.phone],
    ['Delivery address', m.address],
    ['Delivery day', m.deliveryDay === 'THURSDAY' ? 'Thursday' : 'Monday'],
    ['Weekly allocation', `${m.weeklyQuota} meals`],
    ['Dietary parameters', m.dietaryNotes],
  ]
}

export function signupAlertEmail(p: { member: Member; reviewUrl: string }): Rendered {
  const rows = memberRows(p.member)
  return {
    subject: `New portal membership request — ${p.member.name}`,
    html: layout(
      'New Membership Request',
      `${p.member.name} requested portal access.`,
      paragraph('Review and activate this household to unlock weekly meal selection.') +
        detailsTable(rows) +
        button('Review in Admin', p.reviewUrl),
    ),
    text: `New portal membership request\n\n${rowsText(rows)}\n\nReview: ${p.reviewUrl}`,
  }
}

export function signupReceivedEmail(p: { name: string; autoApproved: boolean; dashboardUrl: string }): Rendered {
  const body = p.autoApproved
    ? 'Your client portal is active. You can now select your meals for the upcoming delivery week.'
    : 'Your membership request has been received. Our concierge team will review your household details and activate your portal — typically within one business day.'
  return {
    subject: p.autoApproved ? 'Your Chef de Serene portal is ready' : 'Membership request received',
    html: layout('Client Access Portal', `Thank you, ${p.name.split(' ')[0]}.`, paragraph(body) + button('Open Your Dashboard', p.dashboardUrl)),
    text: `Thank you, ${p.name}.\n\n${body}\n\n${p.dashboardUrl}`,
  }
}

export function accountActivatedEmail(p: { name: string; loginUrl: string; weeklyQuota: number }): Rendered {
  return {
    subject: 'Your Chef de Serene portal is now active',
    html: layout(
      'Membership Activated',
      `Your weekly allocation is ready, ${p.name.split(' ')[0]}.`,
      paragraph(
        `Your household has been activated for ${p.weeklyQuota} meals per week. Sign in to curate this week's selection from Chef Dwayne's rotating menu.`,
      ) + button('Select This Week’s Meals', p.loginUrl),
    ),
    text: `Your Chef de Serene portal is active (${p.weeklyQuota} meals per week).\nSign in: ${p.loginUrl}`,
  }
}

/* ---------------- Orders ---------------- */

type OrderSummary = {
  clientName: string
  clientEmail: string
  phone?: string | null
  address?: string | null
  dietaryNotes?: string | null
  deliveryLabel: string
  totalMeals: number
  items: LineItem[]
}

export function orderAlertEmail(p: OrderSummary & { adminUrl: string }): Rendered {
  const rows: Row[] = [
    ['Client', p.clientName],
    ['Email', p.clientEmail],
    ['Phone', p.phone],
    ['Delivery', p.deliveryLabel],
    ['Address', p.address],
    ['Total meals', p.totalMeals],
    ['Dietary parameters', p.dietaryNotes],
  ]
  return {
    subject: `Weekly order confirmed — ${p.clientName} (${p.totalMeals} meals, ${p.deliveryLabel})`,
    html: layout(
      'Weekly Selection Confirmed',
      `${p.clientName} confirmed ${p.totalMeals} meals.`,
      detailsTable(rows) + itemsTable(p.items) + button('Open Kitchen Prep List', p.adminUrl),
    ),
    text: `Weekly order confirmed\n\n${rowsText(rows)}\n\nSelection:\n${itemsText(p.items)}\n\nAdmin: ${p.adminUrl}`,
  }
}

export function orderConfirmationEmail(p: OrderSummary & { dashboardUrl: string }): Rendered {
  return {
    subject: `Your selection for ${p.deliveryLabel} is confirmed`,
    html: layout(
      'Weekly Selection Confirmed',
      `${p.totalMeals} meals, sealed in glass for ${p.deliveryLabel}.`,
      paragraph('Chef Dwayne’s kitchen has received your selection. Your meals will be placed discreetly into residence refrigeration on delivery day.') +
        itemsTable(p.items) +
        (p.address ? paragraph(`Delivery address: ${p.address}`) : '') +
        button('View in Portal', p.dashboardUrl),
    ),
    text: `Your selection for ${p.deliveryLabel} is confirmed (${p.totalMeals} meals):\n${itemsText(p.items)}\n\n${p.dashboardUrl}`,
  }
}

/* ---------------- Inquiries ---------------- */

export function inquiryAlertEmail(p: { typeLabel: string; name: string; rows: Row[]; adminUrl: string }): Rendered {
  return {
    subject: `New ${p.typeLabel} inquiry — ${p.name}`,
    html: layout(
      `Confidential Inquiry · ${p.typeLabel}`,
      `${p.name} submitted an inquiry.`,
      detailsTable(p.rows) + button('Open Inquiries', p.adminUrl),
    ),
    text: `New ${p.typeLabel} inquiry\n\n${rowsText(p.rows)}\n\nAdmin: ${p.adminUrl}`,
  }
}

export function inquiryReceiptEmail(p: { name: string; typeLabel: string }): Rendered {
  const body = `Thank you for your ${p.typeLabel.toLowerCase()} inquiry. A member of the Chef de Serene team will respond within one business day via a secure channel.`
  return {
    subject: 'Your confidential inquiry has been received',
    html: layout('Confidential Inquiry', `Thank you, ${p.name.split(' ')[0]}.`, paragraph(body)),
    text: `Thank you, ${p.name}.\n\n${body}`,
  }
}
