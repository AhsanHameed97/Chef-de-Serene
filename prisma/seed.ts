import 'dotenv/config'
import { prisma } from '../lib/db'
import { hashPassword } from '../lib/password'
import { MENU_SEED } from '../lib/menu-data'

async function main() {
  // Menu — only seeded into an empty table so admin edits are never overwritten.
  if ((await prisma.menuItem.count()) === 0) {
    await prisma.menuItem.createMany({ data: MENU_SEED.map((item, i) => ({ ...item, sortOrder: i })) })
    console.log(`✓ Seeded ${MENU_SEED.length} menu items`)
  } else {
    console.log('• Menu already has items — skipped')
  }

  // Admin (Chef Dwayne / concierge team)
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@chefdeserene.net').toLowerCase()
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'serene-admin-2026'
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email: adminEmail,
      name: 'Chef Dwayne Childress',
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: await hashPassword(adminPassword),
    },
  })
  console.log(`✓ Admin: ${adminEmail}${process.env.SEED_ADMIN_PASSWORD ? '' : ` / ${adminPassword}`}`)

  // Demo recurring client (skip with SEED_DEMO=false)
  if (process.env.SEED_DEMO !== 'false') {
    const email = 'client@chefdeserene.net'
    const existing = await prisma.user.findUnique({ where: { email } })
    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          name: 'Principal Household',
          status: 'ACTIVE',
          phone: '+1 (310) 555-0199',
          address: 'Bel Air Estate, Los Angeles, CA 90077',
          deliveryDay: 'MONDAY',
          weeklyQuota: 14,
          dietaryNotes: 'Gluten-free, dairy-light, low-glycemic',
          passwordHash: await hashPassword('serene-client-2026'),
          subscriptions: { create: { planName: '14 Meal Glassware Protocol', mealsPerWk: 14 } },
        },
      })
    }
    console.log(`✓ Demo client: ${email} / serene-client-2026`)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
