'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Fades [data-reveal] elements in as they enter the viewport (ported from the static site). */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)')
    els.forEach((el) => {
      const delay = el.dataset.revealDelay
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
    })
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return null
}
