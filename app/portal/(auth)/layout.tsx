import Link from 'next/link'

export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-obsidian">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/hero-estate-kitchen.webp" alt="" className="h-full w-full object-cover opacity-[0.16] blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,rgba(10,10,10,0.55),#0A0A0A_75%)]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-10">
        <Link href="/" className="mono-label text-[10px] text-muted transition-colors hover:text-gold">
          &larr; Chefdeserene.com
        </Link>
        <span className="mono-label hidden text-[10px] text-muted/70 sm:block">[ Confidential &amp; NDA Compliant ]</span>
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pb-16 pt-4 sm:items-center sm:pt-0">{children}</main>
    </div>
  )
}
