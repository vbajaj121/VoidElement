import { z } from 'zod'

export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>
