export default function Loading() {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-background">
      <div className="relative h-10 w-10">
        <span className="border-t-accent-champagne absolute inset-0 animate-spin rounded-full border border-white/10" />
      </div>
    </div>
  )
}
