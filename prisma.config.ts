import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// CLI (migrations/seed) connection. Use DIRECT_URL for a non-pooled connection when the
// app's DATABASE_URL goes through a pooler (Neon/Supabase); otherwise DATABASE_URL is used.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
})
