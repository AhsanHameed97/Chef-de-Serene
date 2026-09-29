import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// CLI (migrations/seed) connection. Prefers a direct (non-pooled) URL when the app's
// DATABASE_URL goes through a pooler. DATABASE_URL_UNPOOLED / POSTGRES_URL_NON_POOLING are
// set automatically by Vercel's Neon integration.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL,
  },
})
