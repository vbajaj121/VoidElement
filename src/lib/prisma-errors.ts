import { Prisma } from '@prisma/client'

/**
 * With @prisma/adapter-pg (Prisma 7's driver-adapter mode), some constraint
 * violations don't surface under Prisma's usual top-level error code — a
 * foreign-key RESTRICT violation was observed coming through as `P2039`
 * rather than the traditional `P2003`, with the real Postgres SQLSTATE
 * nested under `err.meta.driverAdapterError.cause.code`. Check both layers
 * so this doesn't silently stop matching if that mapping shifts again.
 */
function driverCauseCode(err: Prisma.PrismaClientKnownRequestError): string | undefined {
  const meta = err.meta as { driverAdapterError?: { cause?: { code?: string } } } | undefined
  return meta?.driverAdapterError?.cause?.code
}

/** Postgres 23503 = foreign_key_violation, 23001 = restrict_violation. */
export function isForeignKeyViolation(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return false
  const cause = driverCauseCode(err)
  return err.code === 'P2003' || cause === '23503' || cause === '23001'
}

/** Postgres 23505 = unique_violation. */
export function isUniqueConstraintViolation(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return false
  return err.code === 'P2002' || driverCauseCode(err) === '23505'
}
