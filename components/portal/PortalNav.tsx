'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavLink = { href: string; label: string; exact?: boolean }

export function PortalNav({ links, className = '' }: { links: NavLink[]; className?: string }) {
  const pathname = usePathname()
  return (
    <nav className={className} aria-label="Portal">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`mono-label shrink-0 border-b py-2 text-[10.5px] transition-colors ${
              active ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-alabaster'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
