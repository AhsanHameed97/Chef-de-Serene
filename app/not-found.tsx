import Link from 'next/link'
import { Monogram } from '@/components/Monogram'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
      <Monogram size={48} />
      <p className="mono-label mt-8 text-[12.5px] text-gold">Error 404</p>
      <h1 className="mt-4 font-serif text-[40px] leading-tight tracking-[-0.02em]">This page is not on the menu.</h1>
      <p className="mt-3 max-w-md text-muted">The page you requested has moved or never existed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-gold">
          Return Home
        </Link>
        <Link href="/current-menu" className="btn-outline">
          View Current Menu
        </Link>
      </div>
    </main>
  )
}
