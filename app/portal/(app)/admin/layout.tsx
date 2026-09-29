import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:py-14">{children}</main>
}
