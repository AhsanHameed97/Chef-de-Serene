'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Monogram } from '@/components/Monogram'
import { useInquiry } from '@/components/site/InquiryContext'
import { SITE_LINKS } from '@/components/site/nav-links'

function NavContent({ onBurger }: { onBurger: () => void }) {
  const pathname = usePathname()
  const { openInquiry } = useInquiry()
  return (
    <div className="nav-inner">
      <Link href="/" className="brand-lockup" aria-label="Chef de Serene — Home">
        <Monogram size={40} />
        <span className="brand-lockup-word">Chef de Serene</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {SITE_LINKS.map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="nav-cta-wrap">
        <Link href="/portal/login" className="nav-portal">
          Client Portal
        </Link>
        <button type="button" className="nav-inquiry" onClick={() => openInquiry()}>
          Confidential Inquiry
        </button>
        <button type="button" className="nav-burger" aria-label="Open menu" onClick={onBurger}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>
  )
}

/** Transparent nav drawn inside the homepage hero frame. */
export function HeroNav() {
  const [, setOpen] = useMobileNav()
  return (
    <div className="hero-nav">
      <NavContent onBurger={() => setOpen(true)} />
    </div>
  )
}

/* Tiny shared store so the hero nav and sticky nav drive one mobile menu. */
let mobileListeners: ((open: boolean) => void)[] = []
let mobileOpen = false
function setMobileOpen(open: boolean) {
  mobileOpen = open
  mobileListeners.forEach((l) => l(open))
}
function useMobileNav(): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(mobileOpen)
  useEffect(() => {
    mobileListeners.push(setOpen)
    return () => {
      mobileListeners = mobileListeners.filter((l) => l !== setOpen)
    }
  }, [])
  return [open, setMobileOpen]
}

export function SiteNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useMobileNav()
  const { openInquiry } = useInquiry()

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => setOpen(false), [pathname, setOpen])

  return (
    <>
      <header className={`site-nav${!isHome || scrolled ? ' is-visible' : ''}`}>
        <NavContent onBurger={() => setOpen(true)} />
      </header>
      {!isHome && <div className="site-nav-spacer" aria-hidden="true" />}

      <div className={`mobile-nav${open ? ' open' : ''}`} aria-hidden={!open}>
        <button type="button" className="mobile-nav-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          &times;
        </button>
        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          Home
        </Link>
        {SITE_LINKS.map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
            {link.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col items-center gap-5">
          <button
            type="button"
            className="nav-inquiry !inline-block"
            onClick={() => {
              setOpen(false)
              openInquiry()
            }}
          >
            Confidential Inquiry
          </button>
          <Link href="/portal/login" className="nav-portal !inline">
            Client Portal Login
          </Link>
        </div>
      </div>
    </>
  )
}
