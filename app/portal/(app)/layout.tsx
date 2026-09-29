import { requireUser } from '@/lib/auth'
import { PortalHeader } from '@/components/portal/PortalHeader'

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return (
    <div className="min-h-screen bg-obsidian">
      <PortalHeader name={user.name} isAdmin={user.role === 'ADMIN'} />
      {children}
    </div>
  )
}
