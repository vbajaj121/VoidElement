import type { Metadata } from "next"
import { GlassPanel } from "@/components/ui/glass-panel"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6 py-32">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">{children}</GlassPanel>
    </main>
  )
}
