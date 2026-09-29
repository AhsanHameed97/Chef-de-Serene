import { NextResponse } from 'next/server'
import { getActiveMenu, toDishView } from '@/lib/portal'

export const dynamic = 'force-dynamic'

// GET /api/menu — this week's active dishes as JSON (for the phase-3 mobile app and integrations).
export async function GET() {
  const items = await getActiveMenu()
  return NextResponse.json({ items: items.map(toDishView) })
}
