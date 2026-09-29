// Optional instant SMS alert via Twilio's REST API (Master Spec: "Twilio SMS").
// Enabled only when all TWILIO_* variables and NOTIFY_SMS_TO are set.

export async function sendSmsAlert(body: string): Promise<void> {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM: from, NOTIFY_SMS_TO: to } = process.env
  if (!sid || !token || !from || !to) return
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body.slice(0, 600) }),
    })
    if (!res.ok) console.error('[sms] Twilio error', res.status, await res.text())
  } catch (err) {
    console.error('[sms] failed', err)
  }
}
