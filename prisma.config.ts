import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // CLI operations (migrate, db push) need the direct connection — see
    // the comment in .env for why the app itself uses the pooled one.
    url: env('DIRECT_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
