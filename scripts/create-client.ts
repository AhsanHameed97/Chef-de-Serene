// Usage:
//   npm run client:create -- --email jane@familyoffice.com --name "Jane Doe" --quota 14 \
//     [--password secret123] [--address "…"] [--phone "…"] [--day MONDAY|THURSDAY] [--admin]
import 'dotenv/config'
import { parseArgs } from 'node:util'
import { prisma } from '../lib/db'
import { hashPassword } from '../lib/password'

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    name: { type: 'string' },
    quota: { type: 'string', default: '14' },
    password: { type: 'string' },
    address: { type: 'string' },
    phone: { type: 'string' },
    day: { type: 'string', default: 'MONDAY' },
    admin: { type: 'boolean', default: false },
  },
})

async function main() {
  if (!values.email || !values.name) throw new Error('--email and --name are required')
  const quota = Number(values.quota)
  const day = values.day === 'THURSDAY' ? 'THURSDAY' : 'MONDAY'
  const user = await prisma.user.create({
    data: {
      email: values.email.trim().toLowerCase(),
      name: values.name,
      role: values.admin ? 'ADMIN' : 'CLIENT',
      status: 'ACTIVE',
      weeklyQuota: quota,
      deliveryDay: day,
      address: values.address,
      phone: values.phone,
      passwordHash: values.password ? await hashPassword(values.password) : null,
      subscriptions: values.admin ? undefined : { create: { planName: `${quota} Meal Glassware Protocol`, mealsPerWk: quota } },
    },
  })
  console.log(`✓ Created ${user.role.toLowerCase()} ${user.email}. They can sign in with a magic link at /portal/login.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err instanceof Error ? err.message : err)
    await prisma.$disconnect()
    process.exit(1)
  })
