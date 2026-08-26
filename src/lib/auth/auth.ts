import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import { loginSchema } from '@/lib/validation/auth'
import { rateLimit } from '@/lib/rate-limit'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw)
        if (!parsed.success) return null

        // Keyed by email, not IP — this callback doesn't have easy access to
        // the request in every deployment target, and email-keying still
        // stops unlimited brute force against any one account (including
        // the admin's) without needing IP plumbing.
        const limited = rateLimit(`login:${parsed.data.email}`, 5, 5 * 60_000)
        if (!limited.ok) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user?.password) return null
        if (!user.emailVerified) return null

        const bcrypt = await import('bcryptjs')
        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: import('@prisma/client').Role }).role
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = (token.role ?? 'CUSTOMER') as (typeof session.user)['role']
      }
      return session
    },
  },
})
