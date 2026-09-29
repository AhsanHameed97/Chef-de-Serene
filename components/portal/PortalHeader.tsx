import Link from 'next/link'
import { Monogram } from '@/components/Monogram'
import { PortalNav, type NavLink } from '@/components/portal/PortalNav'
import { logoutAction } from '@/lib/actions/auth'

const CLIENT_LINKS: NavLink[] = [
  { href: '/portal/dashboard', label: 'This Week' },
  { href: '/portal/orders', label: 'Order History' },
  { href: '/portal/account', label: 'Account' },
]

const ADMIN_LINKS: NavLink[] = [
  { href: '/portal/admin', label: 'Overview', exact: true },
  { href: '/portal/admin/orders', label: 'Orders' },
  { href: '/portal/admin/clients', label: 'Clients' },
  { href: '/portal/admin/menu', label: 'Menu' },
  { href: '/portal/admin/inquiries', label: 'Bookings' },
]

export function PortalHeader({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const links = isAdmin ? ADMIN_LINKS : CLIENT_LINKS
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-obsidian/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-4 sm:px-6">
        <Link href={isAdmin ? '/portal/admin' : '/portal/dashboard'} className="flex items-center gap-3">
          <Monogram size={34} />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[13.5px] uppercase tracking-[0.3em] text-alabaster">Chef de Serene</span>
            <span className="mono-label text-[11px] text-gold">{isAdmin ? 'Concierge Admin' : 'Client Portal'}</span>
          </span>
        </Link>

        <PortalNav links={links} className="hidden items-center gap-7 md:flex" />

        <div className="ml-auto flex items-center gap-5">
          <Link href="/" className="mono-label hidden text-[12px] text-muted hover:text-alabaster lg:block">
            Website ↗
          </Link>
          <span className="hidden h-4 w-px bg-line lg:block" />
          <span className="hidden max-w-[200px] truncate text-[14.5px] text-muted sm:block">{name}</span>
          <form action={logoutAction}>
            <button type="submit" className="mono-label text-[12px] text-muted transition-colors hover:text-gold">
              Logout
            </button>
          </form>
        </div>
      </div>
      <PortalNav
        links={links}
        className="flex h-10 items-center gap-6 overflow-x-auto border-t border-line px-4 [scrollbar-width:none] md:hidden"
      />
    </header>
  )
}
