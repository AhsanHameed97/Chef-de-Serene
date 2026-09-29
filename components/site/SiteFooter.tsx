import Link from 'next/link'
import { Monogram } from '@/components/Monogram'
import { SITE_LINKS } from '@/components/site/nav-links'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* Serif wordmark + CdS crest (replaces the former graffiti wordmark — Master Spec §1) */}
      <div className="footer-crest" data-reveal>
        <Monogram size={40} />
        <span className="footer-crest-word">Chef de Serene</span>
      </div>

      <div className="footer-row">
        <p className="footer-tag">Functional Fine Dining for Elite Performers &amp; Private Estates</p>
        <nav className="footer-nav" aria-label="Footer">
          {SITE_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/portal/login">Client Portal</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">&copy; {new Date().getFullYear()} Chef de Serene. All Rights Reserved.</p>
        <div className="footer-contact">
          <a href="tel:+13105550187">+1 (310) 555-0187</a>
          <a href="mailto:concierge@chefdeserene.com">concierge@chefdeserene.com</a>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.3-.04-1.2-.13-2.3-.13-2.3 0-3.9 1.4-3.9 3.96V10.5H8v3h2.3V21h3.2z" />
            </svg>
          </a>
          <a href="#" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 7.3c-.6.27-1.2.45-1.9.53a3.3 3.3 0 0 0 1.45-1.83c-.63.38-1.34.65-2.08.8a3.28 3.28 0 0 0-5.6 3 9.3 9.3 0 0 1-6.76-3.43 3.28 3.28 0 0 0 1.02 4.38c-.54-.02-1.05-.17-1.5-.4v.04a3.28 3.28 0 0 0 2.63 3.22c-.48.13-1 .16-1.5.06a3.28 3.28 0 0 0 3.07 2.28A6.59 6.59 0 0 1 4 17.4a9.28 9.28 0 0 0 5.03 1.48c6.04 0 9.34-5 9.34-9.34l-.01-.42c.64-.46 1.2-1.04 1.64-1.7z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
