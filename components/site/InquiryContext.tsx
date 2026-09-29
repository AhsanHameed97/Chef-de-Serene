'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { InquiryWizard, type Fork } from '@/components/site/InquiryWizard'

type InquiryApi = { openInquiry: (fork?: Fork) => void }

const InquiryContext = createContext<InquiryApi>({ openInquiry: () => {} })

export function useInquiry() {
  return useContext(InquiryContext)
}

/**
 * "Confidential Inquiry" triggers: on the homepage they smooth-scroll to the inline
 * 2-fork engine; everywhere else they open it in an overlay (Master Spec §4).
 */
export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [fork, setFork] = useState<Fork | undefined>()
  const [session, setSession] = useState(0)

  const openInquiry = useCallback(
    (nextFork?: Fork) => {
      const inline = pathname === '/' && !nextFork ? document.getElementById('inquiry') : null
      if (inline) {
        inline.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      setFork(nextFork)
      setSession((s) => s + 1)
      setOpen(true)
    },
    [pathname],
  )

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <InquiryContext.Provider value={{ openInquiry }}>
      {children}
      <div className={`modal-backdrop${open ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && close()} aria-hidden={!open}>
        <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Confidential inquiry">
          <button type="button" className="modal-close" onClick={close} aria-label="Close">
            &times;
          </button>
          {session > 0 && <InquiryWizard key={session} initialFork={fork} variant="modal" onClose={close} />}
        </div>
      </div>
    </InquiryContext.Provider>
  )
}

/** Any button that opens the inquiry engine, optionally pre-selecting a fork. */
export function InquiryButton({ fork, className, children }: { fork?: Fork; className?: string; children: React.ReactNode }) {
  const { openInquiry } = useInquiry()
  return (
    <button type="button" className={className} onClick={() => openInquiry(fork)}>
      {children}
    </button>
  )
}
